"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  DollarSign,
  Copy,
  Check,
  Search,
} from "lucide-react";
import { getAdminTransactions } from "@/lib/api";
import { Transaction } from "@/types";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TransactionsLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      try {
        const data = await getAdminTransactions();
        if (isMounted) {
          setTransactions(data);
          setLoading(false);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to load payment transactions";
          toast.error(errorMsg);
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopySessionId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Stripe Session ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = transactions.filter((t) =>
    (t.customerName || "").toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    (t.serviceName || "").toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    t.stripeSessionId.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const totalVolume = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
          Financial Ledger
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-0.5">
          Payment Transactions
        </h1>
        <p className="text-xs sm:text-sm text-[#2D241E]/70 mt-1">
          Immutable audit record of client payments verified through Stripe webhooks.
        </p>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EFECE6] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#2D241E]/60 uppercase font-semibold">
              Total Captured Revenue
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#2D241E] mt-0.5">
              ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EFECE6] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#2D241E]/60 uppercase font-semibold">
              Successful Transactions
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#2D241E] mt-0.5">
              {transactions.filter((t) => t.status === "paid").length} / {transactions.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFECE6] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#2D241E]/40 ml-1" />
        <input
          type="text"
          placeholder="Search transactions by client name, service, or Stripe session ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm bg-transparent outline-none placeholder:text-[#2D241E]/40"
        />
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" />
          <p className="mt-3 text-sm text-[#2D241E]/60">Loading transaction history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EFECE6] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2D241E]">
            No transactions found
          </h3>
          <p className="text-xs sm:text-sm text-[#2D241E]/65 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? "No payment records match your search filter."
              : "No payments have been processed through Stripe Checkout yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-[#FAF6F0]/80">
              <TableRow className="border-[#EFECE6]">
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pl-6">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Service
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Stripe Session Reference
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pr-6 text-right">
                  Transaction Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t._id} className="border-[#EFECE6] hover:bg-[#FAF6F0]/40">
                  {/* Customer */}
                  <TableCell className="pl-6 py-4">
                    <p className="font-semibold text-sm text-[#2D241E]">
                      {t.customerName || "Customer"}
                    </p>
                  </TableCell>

                  {/* Service */}
                  <TableCell className="text-xs text-[#2D241E]/70 font-medium">
                    {t.serviceName || "Salon Treatment"}
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="font-serif font-bold text-sm text-[#9E5739]">
                    ${t.amount.toFixed(2)} {t.currency}
                  </TableCell>

                  {/* Stripe Session ID */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-[#2D241E]/70 bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EFECE6]">
                        {t.stripeSessionId.slice(0, 16)}...
                      </span>
                      <button
                        onClick={() => handleCopySessionId(t.stripeSessionId)}
                        className="text-[#2D241E]/40 hover:text-[#9E5739] transition-colors"
                        title="Copy Stripe Session ID"
                      >
                        {copiedId === t.stripeSessionId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    {t.status === "paid" ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-700 border-red-200">
                        Failed
                      </Badge>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="pr-6 text-right text-xs text-[#2D241E]/60">
                    {new Date(t.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
