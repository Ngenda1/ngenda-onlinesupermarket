import { PaymentMethods } from "@/components/PaymentMethods";

const Checkout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ngenda-50 to-ngenda-100">
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <PaymentMethods />
      </div>
    </div>
  );
};

export default Checkout;