// ============================================================
//  EXPLAIN-THE-CODE — Production-style snippets
// ============================================================
//
//  Read the code below like you would in a PR review.
//  Explain in chat: what it does, how it flows, and where
//  scoping matters (block vs function).
//
//  CURRENT: 1.2 Block scope vs function scope
// ============================================================


/**
 * Validates a checkout payload and schedules retry notifications
 * for failed payment attempts. Used by the billing webhook handler.
 */
function processCheckoutAttempt(checkout, webhookConfig) {
  const MAX_RETRIES = webhookConfig.maxRetries ?? 3;
  const failures = [];

  if (!checkout.customerId) {
    const errorCode = "MISSING_CUSTOMER";
    failures.push({ code: errorCode, field: "customerId" });
    return { ok: false, failures };
  }

  if (checkout.items.length === 0) {
    const errorCode = "EMPTY_CART";
    failures.push({ code: errorCode, field: "items" });
    return { ok: false, failures };
  }

  let attempt = checkout.paymentAttempt ?? 0;

  while (attempt < MAX_RETRIES) {
    const chargeResult = simulateCharge(checkout);

    if (chargeResult.success) {
      return {
        ok: true,
        chargeId: chargeResult.chargeId,
        attempt: attempt + 1,
      };
    }

    attempt += 1;

    if (attempt < MAX_RETRIES) {
      scheduleRetryNotice(checkout.customerId, attempt, MAX_RETRIES);
    } else {
      failures.push({
        code: "PAYMENT_FAILED",
        lastError: chargeResult.error,
        attempts: attempt,
      });
    }
  }

  return { ok: false, failures };
}

function simulateCharge(checkout) {
  const shouldFail = checkout.total > 500;
  if (shouldFail) {
    return { success: false, error: "Card declined" };
  }
  return { success: true, chargeId: `ch_${checkout.id}` };
}

function scheduleRetryNotice(customerId, attempt, maxRetries) {
  const delayMs = attempt * 1000;

  setTimeout(() => {
    console.log(
      `[billing] Retry ${attempt}/${maxRetries} scheduled for customer ${customerId} in ${delayMs}ms`
    );
  }, delayMs);
}

function runBillingSimulation() {
  const checkout = {
    id: "ord_1042",
    customerId: "cus_88",
    items: [{ sku: "laptop", qty: 1 }],
    total: 600,
    paymentAttempt: 0,
  };

  console.log("--- Processing high-value order (will fail) ---");
  const result = processCheckoutAttempt(checkout, { maxRetries: 3 });
  console.log("Result:", result);

  console.log("\n--- Processing normal order (will succeed) ---");
  const cheapCheckout = { ...checkout, id: "ord_1043", total: 120 };
  const cheapResult = processCheckoutAttempt(cheapCheckout, { maxRetries: 3 });
  console.log("Result:", cheapResult);
}

runBillingSimulation();


// ── After reading, explain in chat ──
// 1. Walk through what happens when the $600 order is processed.
// 2. Why is `errorCode` declared with const inside each if-block?
//    Could one `errorCode` at the top of the function work instead?
// 3. Why is `attempt` a let outside the while-loop, not const inside it?
// 4. In scheduleRetryNotice, why does the setTimeout callback correctly
//    log the right `attempt` each time? (What if the loop used var?)
// 5. What is `failures` scoped to — who can read or modify it?
