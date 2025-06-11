"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { z } from "zod";
import { DottedSeparator } from "../dotted-seperator";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { useTodos } from "@/hooks/use-todos";
import { useRepoModal } from "@/hooks/use-modal";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { ChevronDownIcon } from "lucide-react";

export function TodoForm({ todo }) {
  const { closeModal, mode } = useRepoModal();

  const todoSchema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().nullable(),
    start: z.string().datetime().nullable(),
    end: z.string().datetime().nullable(),
    duration: z.string().nullable().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]),
    archived: z.boolean(),
    tags: z.string().nullable().optional(),
  });

  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      name: todo?.name || "",
      description: todo?.description || "",
      priority: todo?.priority?.toUpperCase() || undefined,
      status: todo?.status?.toUpperCase() || undefined,
      tags: todo?.tags || undefined,
      start: todo?.start || null,
      end: todo?.end || null,
      duration: todo?.duration?.toString() ?? undefined,
      archived: todo?.archived || false,
    },
  });
  const [open, setOpen] = useState(false);
  const [dateOnly, setDateOnly] = useState(undefined);
  const [time, setTime] = useState("10:30:00");
  const [dateTime, setDateTime] = useState(
    todo?.start ? new Date(todo.start) : undefined
  );

  // End time state
  const [openEnd, setOpenEnd] = useState(false);
  const [endDate, setEndDate] = useState(undefined);
  const [endTime, setEndTime] = useState("11:00:00");
  const [endDateTime, setEndDateTime] = useState(
    todo?.end ? new Date(todo.end) : undefined
  );

  useEffect(() => {
    if (dateOnly && time) {
      const [h, m, s] = time.split(":").map(Number);
      const updated = new Date(dateOnly);
      updated.setHours(h);
      updated.setMinutes(m);
      updated.setSeconds(s);
      setDateTime(updated);
    }
  }, [dateOnly, time]);

  useEffect(() => {
    if (endDate && endTime) {
      const [h, m, s] = endTime.split(":").map(Number);
      const updated = new Date(endDate);
      updated.setHours(h);
      updated.setMinutes(m);
      updated.setSeconds(s);
      setEndDateTime(updated);
      form.setValue("end", updated.toISOString());
    }
  }, [endDate, endTime]);

  const { create, update } = useTodos({});

  const onSubmit = async (values) => {
    console.log("Form submitted with values:", values);
    console.log("date", dateTime);
    console.log("endDateTime", endDateTime);
    try {
      if (mode === "edit" && todo?.id) {
        console.log("Updating todo with ID:", todo.id);
        const formattedValues = {
          ...values,
          start: dateTime ? dateTime.toISOString() : null,
          end: endDateTime ? endDateTime.toISOString() : null,
          duration: Number(values.duration) || 30, // Default to 30 if not provided
          owner: "Rahdeg",
        };
        console.log("formattedValues:", formattedValues);
        try {
          await update.mutateAsync({ id: todo.id, data: formattedValues });
        } catch (error) {
          console.error(error);
        }
      } else {
        const formattedValues = {
          ...values,
          start: dateTime ? dateTime.toISOString() : null,
          end: endDateTime ? endDateTime.toISOString() : null,
          duration: Number(values.duration) || 30, // Default to 30 if not provided
          owner: "Rahdeg",
        };
        await create.mutateAsync(formattedValues);
      }

      form.reset();
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{mode === "edit" ? "Edit" : "Create"} Task</CardTitle>
      </CardHeader>
      <CardContent className="p-6 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" flex flex-col gap-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={create.isPending || update.isPending}
                        type="text"
                        placeholder="Enter todo name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="description"
                        disabled={create.isPending || update.isPending}
                        type="text"
                        placeholder="Enter todo description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your task status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        <SelectItem value="TODO">TODO</SelectItem>
                        <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
                        <SelectItem value="DONE">DONE</SelectItem>
                        <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DottedSeparator className="py-3" />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="priority">Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder=" Select your task priority " />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        <SelectItem value="LOW">LOW</SelectItem>
                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                        <SelectItem value="HIGH">HIGH</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="tags">Tags</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your task tag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        <SelectItem value="DESIGN">DESIGN</SelectItem>
                        <SelectItem value="DEVELOPMENT">DEVELOPMENT</SelectItem>
                        <SelectItem value="CODING">CODING</SelectItem>
                        <SelectItem value="LEISURE">LEISURE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="duration">Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        <SelectItem value="30">30MINS</SelectItem>
                        <SelectItem value="40">40MINS</SelectItem>
                        <SelectItem value="50">50MINS</SelectItem>
                        <SelectItem value="60">1HR</SelectItem>
                        <SelectItem value="120">2HRS</SelectItem>
                        <SelectItem value="180">3HRS</SelectItem>
                        <SelectItem value="240">4HRS</SelectItem>
                        <SelectItem value="300">5HRS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DottedSeparator className="py-3" />
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date" className="px-1">
                    Start Date
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                      >
                        {dateTime ? dateTime.toLocaleString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={dateOnly}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                          setDateOnly(d || undefined);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="time" className="px-1">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    id="time"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-full"
                  />
                </div>
              </div>

              <DottedSeparator className="py-3" />
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="end-date" className="px-1">
                    End Date
                  </Label>
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="end-date"
                        className="w-full justify-between font-normal"
                      >
                        {endDateTime
                          ? endDateTime.toLocaleString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={endDate}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                          setEndDate(d || undefined);
                          setOpenEnd(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Label htmlFor="end-time" className="px-1">
                    End Time
                  </Label>
                  <Input
                    type="time"
                    id="end-time"
                    step="1"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-full"
                  />
                </div>
              </div>
            </div>

            <DottedSeparator className="py-7" />

            <div className=" flex items-center justify-between">
              <Button
                className={cn(!closeModal && "invisible")}
                onClick={closeModal}
                disabled={create.isPending || update.isPending}
                size="lg"
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                disabled={create.isPending || update.isPending}
                size="lg"
                type="submit"
              >
                {mode === "edit" ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
