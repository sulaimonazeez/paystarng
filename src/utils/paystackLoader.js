export const loadPaystack = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });
};