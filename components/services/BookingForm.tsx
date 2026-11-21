"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"
import { Service, User } from "@/types"
import { createAppointment } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  service: Service
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

export default function BookingForm({
  service,
  user,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter()

  const [date, setDate] = useState<string>("")
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const today = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast.error("Please choose an appointment date")
      return
    }

    if (date < today) {
      toast.error("Appointment date cannot be in the past")
      return
    }

    if (!timeSlot) {
      toast.error("Please choose a time slot")
      return
    }

    try {
      setLoading(true)
      await createAppointment({
        serviceId: service._id,
        customerId: user.id,
        serviceName: service.serviceName,
        serviceImage: service.image,
        category: service.category,
        customerName: user.name,
        customerEmail: user.email,
        appointmentDate: date,
        timeSlot: timeSlot,
        message: message.trim() || undefined,
        servicePrice: service.price,
      })

      toast.success("Appointment booked successfully!")
      onOpenChange(false)
      router.push("/dashboard/customer/appointments")
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to book appointment"
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="relative rounded-3xl border-[#EFECE6] bg-white p-6 text-[#2D241E] shadow-lg sm:max-w-md"
      >
        {/* Clearly visible close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-5 right-5 rounded-full p-1 text-[#2D241E]/60 transition-colors hover:bg-[#FAF6F0] hover:text-[#2D241E]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-bold text-[#2D241E]">
            Book Appointment
          </DialogTitle>
          <DialogDescription className="text-sm text-[#2D241E]/75">
            {service.serviceName} &bull; ${service.price} &bull;{" "}
            {service.duration} mins
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {/* Appointment Date */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
              Appointment Date
            </label>
            <Input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ colorScheme: "light" }}
              className="h-11 w-full cursor-pointer border-[#EFECE6] bg-[#FAF6F0] px-3.5 text-sm font-medium text-[#2D241E] [color-scheme:light] focus-visible:ring-[#9E5739] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-75 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:text-[#2D241E] [&::-webkit-datetime-edit-fields-wrapper]:text-[#2D241E]"
              required
            />
          </div>

          {/* Time Slot Select */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
              Time Slot
            </label>
            <Select
              value={timeSlot}
              onValueChange={(val) => setTimeSlot(val || "")}
            >
              <SelectTrigger className="h-11 w-full border-[#EFECE6] bg-[#FAF6F0] px-3.5 text-sm font-medium text-[#2D241E] focus:ring-[#9E5739] data-placeholder:text-[#2D241E]/60">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent className="border-[#EFECE6] bg-white text-[#2D241E]">
                {timeSlots.map((slot) => (
                  <SelectItem
                    key={slot}
                    value={slot}
                    className="cursor-pointer text-[#2D241E] hover:bg-[#FAF6F0] focus:bg-[#FAF6F0]"
                  >
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Message */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#2D241E] uppercase">
              Additional Message (Optional)
            </label>
            <Textarea
              rows={3}
              placeholder="Any notes, hair/skin specifics or requests..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none border-[#EFECE6] bg-[#FAF6F0] text-sm text-[#2D241E] placeholder:text-[#2D241E]/50 focus-visible:ring-[#9E5739]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-10 border-[#EFECE6] px-4 font-medium text-[#2D241E] hover:bg-[#FAF6F0]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 bg-[#9E5739] px-5 font-medium text-white hover:bg-[#8B4A2F]"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
