export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          attended_at: string
          class_id: string
          class_session_id: string | null
          created_at: string
          id: string
          notes: string | null
          professor_id: string | null
          profile_id: string
        }
        Insert: {
          attended_at?: string
          class_id: string
          class_session_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          professor_id?: string | null
          profile_id: string
        }
        Update: {
          attended_at?: string
          class_id?: string
          class_session_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          professor_id?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_class_session_id_fkey"
            columns: ["class_session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      belts: {
        Row: {
          classes_to_next_belt: number | null
          color_hex: string
          created_at: string
          id: string
          name: string
          rank_order: number
        }
        Insert: {
          classes_to_next_belt?: number | null
          color_hex: string
          created_at?: string
          id?: string
          name: string
          rank_order: number
        }
        Update: {
          classes_to_next_belt?: number | null
          color_hex?: string
          created_at?: string
          id?: string
          name?: string
          rank_order?: number
        }
        Relationships: []
      }
      class_schedules: {
        Row: {
          active: boolean
          capacity: number
          class_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          location: string
          professor_id: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          capacity?: number
          class_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          location?: string
          professor_id?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          capacity?: number
          class_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          location?: string
          professor_id?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedules_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_sessions: {
        Row: {
          cancelled: boolean
          capacity: number
          class_id: string
          created_at: string
          ends_at: string
          id: string
          location: string
          professor_id: string | null
          schedule_id: string | null
          starts_at: string
          updated_at: string
        }
        Insert: {
          cancelled?: boolean
          capacity?: number
          class_id: string
          created_at?: string
          ends_at: string
          id?: string
          location?: string
          professor_id?: string | null
          schedule_id?: string | null
          starts_at: string
          updated_at?: string
        }
        Update: {
          cancelled?: boolean
          capacity?: number
          class_id?: string
          created_at?: string
          ends_at?: string
          id?: string
          location?: string
          professor_id?: string | null
          schedule_id?: string | null
          starts_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sessions_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sessions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "class_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          modality: Database["public"]["Enums"]["modality"]
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          modality: Database["public"]["Enums"]["modality"]
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          modality?: Database["public"]["Enums"]["modality"]
          name?: string
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          age_max: number | null
          age_min: number | null
          belt: string | null
          capacity: number | null
          created_at: string
          event_id: string
          gender: string | null
          id: string
          name: string
          price: number | null
          weight_max: number | null
          weight_min: number | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          belt?: string | null
          capacity?: number | null
          created_at?: string
          event_id: string
          gender?: string | null
          id?: string
          name: string
          price?: number | null
          weight_max?: number | null
          weight_min?: number | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          belt?: string | null
          capacity?: number | null
          created_at?: string
          event_id?: string
          gender?: string | null
          id?: string
          name?: string
          price?: number | null
          weight_max?: number | null
          weight_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_media: {
        Row: {
          caption: string | null
          created_at: string
          event_id: string
          id: string
          media_type: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_id: string
          id?: string
          media_type?: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_id?: string
          id?: string
          media_type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          category_id: string
          created_at: string
          event_id: string
          id: string
          notes: string | null
          payment_status: string
          profile_id: string
          status: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          payment_status?: string
          profile_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          payment_status?: string
          profile_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_reviews: {
        Row: {
          comment: string | null
          created_at: string
          event_id: string
          id: string
          profile_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          event_id: string
          id?: string
          profile_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          event_id?: string
          id?: string
          profile_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          awards: string | null
          banner_url: string | null
          base_price: number | null
          city: string
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          organizer_id: string
          organizer_name: string | null
          registration_deadline: string | null
          regulation_url: string | null
          schedule: string | null
          slug: string
          starts_at: string
          state: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          awards?: string | null
          banner_url?: string | null
          base_price?: number | null
          city: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          organizer_id: string
          organizer_name?: string | null
          registration_deadline?: string | null
          regulation_url?: string | null
          schedule?: string | null
          slug: string
          starts_at: string
          state: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          awards?: string | null
          banner_url?: string | null
          base_price?: number | null
          city?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          organizer_id?: string
          organizer_name?: string | null
          registration_deadline?: string | null
          regulation_url?: string | null
          schedule?: string | null
          slug?: string
          starts_at?: string
          state?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      graduations: {
        Row: {
          created_at: string
          from_belt_id: string | null
          from_degree: number
          graduated_at: string
          id: string
          notes: string | null
          professor_id: string | null
          profile_id: string
          to_belt_id: string
          to_degree: number
        }
        Insert: {
          created_at?: string
          from_belt_id?: string | null
          from_degree?: number
          graduated_at?: string
          id?: string
          notes?: string | null
          professor_id?: string | null
          profile_id: string
          to_belt_id: string
          to_degree?: number
        }
        Update: {
          created_at?: string
          from_belt_id?: string | null
          from_degree?: number
          graduated_at?: string
          id?: string
          notes?: string | null
          professor_id?: string | null
          profile_id?: string
          to_belt_id?: string
          to_degree?: number
        }
        Relationships: [
          {
            foreignKeyName: "graduations_from_belt_id_fkey"
            columns: ["from_belt_id"]
            isOneToOne: false
            referencedRelation: "belts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graduations_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graduations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graduations_to_belt_id_fkey"
            columns: ["to_belt_id"]
            isOneToOne: false
            referencedRelation: "belts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          belt_id: string | null
          birth_date: string | null
          created_at: string
          degree: number
          email: string | null
          enrollment_date: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          belt_id?: string | null
          birth_date?: string | null
          created_at?: string
          degree?: number
          email?: string | null
          enrollment_date?: string | null
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          belt_id?: string | null
          birth_date?: string | null
          created_at?: string
          degree?: number
          email?: string | null
          enrollment_date?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_belt_id_fkey"
            columns: ["belt_id"]
            isOneToOne: false
            referencedRelation: "belts"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          session_id: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          session_id: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          session_id?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "class_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          professor_id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          professor_id: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          professor_id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_notes_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_notes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "professor" | "aluno" | "organizador"
      modality:
        | "bjj_adulto"
        | "bjj_kids"
        | "bjj_juvenil"
        | "funcional"
        | "open_mat"
      reservation_status: "confirmed" | "cancelled" | "attended" | "no_show"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "professor", "aluno", "organizador"],
      modality: [
        "bjj_adulto",
        "bjj_kids",
        "bjj_juvenil",
        "funcional",
        "open_mat",
      ],
      reservation_status: ["confirmed", "cancelled", "attended", "no_show"],
    },
  },
} as const
