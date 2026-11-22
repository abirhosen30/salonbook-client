"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck,
  Mail,
  Phone,
  Search,
} from "lucide-react";
import { getAdminUsers, toggleAdminUserBlock } from "@/lib/api";
import { User } from "@/types";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [blockTarget, setBlockTarget] = useState<User | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getAdminUsers();
        if (isMounted) {
          setUsers(data);
          setLoading(false);
        }
      } catch (error: unknown) {
        if (isMounted) {
          const errorMsg =
            error instanceof Error ? error.message : "Failed to load registered users";
          toast.error(errorMsg);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirmToggleBlock = async () => {
    if (!blockTarget) return;

    try {
      setProcessing(true);
      const nextBlockedState = !blockTarget.isBlocked;
      await toggleAdminUserBlock(blockTarget.id, nextBlockedState);

      toast.success(
        `User ${blockTarget.name} has been ${
          nextBlockedState ? "BLOCKED" : "UNBLOCKED"
        }`
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === blockTarget.id ? { ...u, isBlocked: nextBlockedState } : u
        )
      );
      setBlockTarget(null);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update user status";
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E5739]">
          Access & Security
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D241E] mt-0.5">
          Manage Registered Customers
        </h1>
        <p className="text-xs sm:text-sm text-[#2D241E]/70 mt-1">
          Monitor user accounts, roles, and suspend or restore platform access privileges.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EFECE6] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#2D241E]/40 ml-1" />
        <input
          type="text"
          placeholder="Filter accounts by name or email address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm bg-transparent outline-none placeholder:text-[#2D241E]/40"
        />
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader size="lg" />
          <p className="mt-3 text-sm text-[#2D241E]/60">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EFECE6] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2D241E]">
            No users found
          </h3>
          <p className="text-xs sm:text-sm text-[#2D241E]/65 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? "No registered user matched your filter keyword."
              : "No users have registered on the platform yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EFECE6] shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-[#FAF6F0]/80">
              <TableRow className="border-[#EFECE6]">
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pl-6">
                  User
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Role
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Account Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4">
                  Contact
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#2D241E] uppercase py-4 pr-6 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-[#EFECE6] hover:bg-[#FAF6F0]/40">
                  {/* User Profile */}
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#FAF6F0] text-[#9E5739] flex items-center justify-center font-bold text-sm shrink-0 border border-[#EFECE6]">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#2D241E]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#2D241E]/60 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Badge
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {user.isBlocked ? (
                      <Badge className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1 w-fit">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Blocked</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Active</span>
                      </Badge>
                    )}
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="text-xs text-[#2D241E]/70">
                    {user.phone ? (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#9E5739]" />
                        {user.phone}
                      </span>
                    ) : (
                      <span className="text-[#2D241E]/40 italic">Not set</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 text-right">
                    {user.role === "admin" ? (
                      <span className="text-xs text-[#2D241E]/40 italic">Protected</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBlockTarget(user)}
                        className={`h-8 px-2.5 text-xs ${
                          user.isBlocked
                            ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {user.isBlocked ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 mr-1" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5 mr-1" />
                            Block User
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={Boolean(blockTarget)}
        onOpenChange={(open) => !open && setBlockTarget(null)}
      >
        <AlertDialogContent className="rounded-3xl border-[#EFECE6]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl font-bold text-[#2D241E]">
              {blockTarget?.isBlocked ? "Unblock Account?" : "Block Customer Account?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#2D241E]/70 leading-relaxed">
              {blockTarget?.isBlocked
                ? `Are you sure you want to restore platform booking access for ${blockTarget?.name}?`
                : `Are you sure you want to block ${blockTarget?.name}? While blocked, this customer will be prohibited from accessing dashboard features and submitting appointment requests.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={processing}
              className="rounded-xl border-[#EFECE6] text-[#2D241E]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggleBlock}
              disabled={processing}
              className={`rounded-xl text-white ${
                blockTarget?.isBlocked
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {processing
                ? "Updating..."
                : blockTarget?.isBlocked
                ? "Confirm Unblock"
                : "Confirm Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
