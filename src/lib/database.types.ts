// Database types for Supabase project kqxdrzeocbguzlukqkvg.
// The `Database` type is generated (npm run db:types); the helpers and narrowed
// status types at the bottom are hand-written. After a migration: regenerate,
// keep the bottom part, and copy this file to the website repo.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      booking_settings: {
        Row: {
          buffer_min: number;
          cancel_cutoff_hours: number;
          id: boolean;
          min_notice_hours: number;
          pending_expiry_hours: number;
          reminder_hours_before: number;
          retention_months: number;
          review_request_hours_after: number;
          slot_step_min: number;
          updated_at: string;
          window_days: number;
        };
        Insert: {
          buffer_min?: number;
          cancel_cutoff_hours?: number;
          id?: boolean;
          min_notice_hours?: number;
          pending_expiry_hours?: number;
          reminder_hours_before?: number;
          retention_months?: number;
          review_request_hours_after?: number;
          slot_step_min?: number;
          updated_at?: string;
          window_days?: number;
        };
        Update: {
          buffer_min?: number;
          cancel_cutoff_hours?: number;
          id?: boolean;
          min_notice_hours?: number;
          pending_expiry_hours?: number;
          reminder_hours_before?: number;
          retention_months?: number;
          review_request_hours_after?: number;
          slot_step_min?: number;
          updated_at?: string;
          window_days?: number;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          anonymized_at: string | null;
          blocked_until: string;
          cancelled_at: string | null;
          cancelled_by: string | null;
          created_at: string;
          decided_at: string | null;
          decline_message: string | null;
          duration_min: number;
          email: string | null;
          ends_at: string;
          first_name: string;
          id: string;
          last_name: string;
          manage_token_hash: string | null;
          notes: string | null;
          phone: string | null;
          price_eur: number;
          reminder_queued_at: string | null;
          review_request_queued_at: string | null;
          service_slug: string;
          source: string;
          starts_at: string;
          status: string;
        };
        Insert: {
          anonymized_at?: string | null;
          blocked_until?: string;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          decided_at?: string | null;
          decline_message?: string | null;
          duration_min: number;
          email?: string | null;
          ends_at?: string;
          first_name: string;
          id?: string;
          last_name: string;
          manage_token_hash?: string | null;
          notes?: string | null;
          phone?: string | null;
          price_eur: number;
          reminder_queued_at?: string | null;
          review_request_queued_at?: string | null;
          service_slug: string;
          source?: string;
          starts_at: string;
          status?: string;
        };
        Update: {
          anonymized_at?: string | null;
          blocked_until?: string;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          decided_at?: string | null;
          decline_message?: string | null;
          duration_min?: number;
          email?: string | null;
          ends_at?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          manage_token_hash?: string | null;
          notes?: string | null;
          phone?: string | null;
          price_eur?: number;
          reminder_queued_at?: string | null;
          review_request_queued_at?: string | null;
          service_slug?: string;
          source?: string;
          starts_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      email_outbox: {
        Row: {
          attempts: number;
          booking_id: string | null;
          created_at: string;
          id: number;
          last_error: string | null;
          review_id: string | null;
          sent_at: string | null;
          status: string;
          type: string;
        };
        Insert: {
          attempts?: number;
          booking_id?: string | null;
          created_at?: string;
          id?: never;
          last_error?: string | null;
          review_id?: string | null;
          sent_at?: string | null;
          status?: string;
          type: string;
        };
        Update: {
          attempts?: number;
          booking_id?: string | null;
          created_at?: string;
          id?: never;
          last_error?: string | null;
          review_id?: string | null;
          sent_at?: string | null;
          status?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "email_outbox_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "email_outbox_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      opening_hours: {
        Row: {
          closes: string;
          opens: string;
          weekday: number;
        };
        Insert: {
          closes: string;
          opens: string;
          weekday: number;
        };
        Update: {
          closes?: string;
          opens?: string;
          weekday?: number;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          approved_at: string | null;
          consent_publish: boolean;
          created_at: string;
          id: string;
          name: string;
          rating: number;
          service_slug: string;
          status: string;
          text: string;
        };
        Insert: {
          approved_at?: string | null;
          consent_publish?: boolean;
          created_at?: string;
          id?: string;
          name: string;
          rating: number;
          service_slug: string;
          status?: string;
          text: string;
        };
        Update: {
          approved_at?: string | null;
          consent_publish?: boolean;
          created_at?: string;
          id?: string;
          name?: string;
          rating?: number;
          service_slug?: string;
          status?: string;
          text?: string;
        };
        Relationships: [];
      };
      time_off: {
        Row: {
          created_at: string;
          ends_at: string;
          id: string;
          reason: string | null;
          starts_at: string;
        };
        Insert: {
          created_at?: string;
          ends_at: string;
          id?: string;
          reason?: string | null;
          starts_at: string;
        };
        Update: {
          created_at?: string;
          ends_at?: string;
          id?: string;
          reason?: string | null;
          starts_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      anonymize_old_bookings: { Args: never; Returns: number };
      enqueue_email: {
        Args: { p_booking_id?: string; p_review_id?: string; p_type: string };
        Returns: undefined;
      };
      enqueue_reminders: { Args: never; Returns: number };
      enqueue_review_requests: { Args: never; Returns: number };
      expire_stale_bookings: { Args: never; Returns: number };
      run_booking_jobs: { Args: never; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];

// Status values are enforced by CHECK constraints; narrowed here for the apps.
export type BookingStatus = "pending" | "confirmed" | "declined" | "expired" | "cancelled";
export type BookingSource = "website" | "manual";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type EmailType =
  | "booking_received"
  | "booking_request"
  | "booking_confirmed"
  | "booking_declined"
  | "booking_expired_client"
  | "booking_expired_nataly"
  | "booking_cancelled_by_client"
  | "booking_cancel_confirmation"
  | "booking_cancelled_by_nataly"
  | "booking_reminder"
  | "review_request"
  | "review_moderation";
