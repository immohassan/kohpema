import CartView from "@/components/store/CartView";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-heading font-bold uppercase text-4xl tracking-tight mb-8">
        Your Cart
      </h1>
      <CartView />
    </div>
  );
}
