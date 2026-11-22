export default function TransactionsPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-xs">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E]">
        Transactions
      </h1>
      <p className="mt-2 text-sm text-[#2D241E]/70">
        Review payment transaction history, stripe payment statuses, and invoice records.
      </p>
    </div>
  );
}
