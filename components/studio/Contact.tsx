"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { inquiry, type Inquiry } from "@/lib/inquiry";
import { services } from "@/lib/studio";
export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquiry),
    defaultValues: { website: "", budget: "" },
  });
  const [message, setMessage] = useState("");
  const submit = handleSubmit(async (values) => {
    setMessage("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !data.ok) throw new Error(data.error || "Please try again.");
      reset();
      setMessage("Thank you. Your project inquiry has been received.");
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Unable to submit your inquiry.",
      );
    }
  });
  return (
    <form onSubmit={submit}>
      <label>
        Name
        <input
          required
          autoComplete="name"
          maxLength={100}
          {...register("name")}
        />
      </label>
      <label>
        Email
        <input
          required
          type="email"
          autoComplete="email"
          {...register("email")}
        />
      </label>
      <label>
        Company <small>(optional)</small>
        <input autoComplete="organization" {...register("company")} />
      </label>
      <label>
        Service required
        <select required defaultValue="" {...register("service")}>
          <option value="" disabled>
            Select a service
          </option>
          {services.map(([s]) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="wide">
        Project budget <small>(optional)</small>
        <select {...register("budget")}>
          <option value="">Select a range</option>
          {[
            "Under ₹50,000",
            "₹50,000–₹2 lakh",
            "₹2 lakh+",
            "To be discussed",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="wide">
        Project description
        <textarea
          required
          minLength={15}
          maxLength={5000}
          rows={4}
          placeholder="What would you like to build?"
          {...register("description")}
        />
      </label>
      <input
        className="trap"
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
        {...register("website")}
      />
      <div className="wide formend">
        <button className="primary" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send inquiry"}{" "}
          <ArrowUpRight size={16} />
        </button>
        <span role="status">
          {Object.keys(errors).length
            ? "Please check " + Object.keys(errors).join(", ") + "."
            : message}
        </span>
      </div>
    </form>
  );
}
