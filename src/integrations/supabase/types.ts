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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activation_rate: {
        Row: {
          id: string
          rate: number
          recorded_at: string
          week_label: string
        }
        Insert: {
          id?: string
          rate?: number
          recorded_at?: string
          week_label: string
        }
        Update: {
          id?: string
          rate?: number
          recorded_at?: string
          week_label?: string
        }
        Relationships: []
      }
      activation_steps: {
        Row: {
          id: string
          label: string
          percentage: number
          recorded_at: string
          step_number: number
          total_users: number
        }
        Insert: {
          id?: string
          label: string
          percentage?: number
          recorded_at?: string
          step_number: number
          total_users?: number
        }
        Update: {
          id?: string
          label?: string
          percentage?: number
          recorded_at?: string
          step_number?: number
          total_users?: number
        }
        Relationships: []
      }
      cohort_retention: {
        Row: {
          cohort_label: string
          id: string
          recorded_at: string
          week_1: number | null
          week_2: number | null
          week_4: number | null
          week_8: number | null
        }
        Insert: {
          cohort_label: string
          id?: string
          recorded_at?: string
          week_1?: number | null
          week_2?: number | null
          week_4?: number | null
          week_8?: number | null
        }
        Update: {
          cohort_label?: string
          id?: string
          recorded_at?: string
          week_1?: number | null
          week_2?: number | null
          week_4?: number | null
          week_8?: number | null
        }
        Relationships: []
      }
      data_activity: {
        Row: {
          count: number
          event_type: string
          hour: number
          id: string
          recorded_at: string
        }
        Insert: {
          count?: number
          event_type: string
          hour: number
          id?: string
          recorded_at?: string
        }
        Update: {
          count?: number
          event_type?: string
          hour?: number
          id?: string
          recorded_at?: string
        }
        Relationships: []
      }
      ecosystem_integrations: {
        Row: {
          connected_pct: number
          id: string
          integration_name: string
          recorded_at: string
          status: string | null
        }
        Insert: {
          connected_pct?: number
          id?: string
          integration_name: string
          recorded_at?: string
          status?: string | null
        }
        Update: {
          connected_pct?: number
          id?: string
          integration_name?: string
          recorded_at?: string
          status?: string | null
        }
        Relationships: []
      }
      engagement_scores: {
        Row: {
          id: string
          metric_name: string
          overall_score: number
          recorded_at: string
          score: number
        }
        Insert: {
          id?: string
          metric_name: string
          overall_score?: number
          recorded_at?: string
          score?: number
        }
        Update: {
          id?: string
          metric_name?: string
          overall_score?: number
          recorded_at?: string
          score?: number
        }
        Relationships: []
      }
      feature_adoption: {
        Row: {
          adoption_pct: number
          category: string
          feature_name: string
          id: string
          recorded_at: string
          trend: string | null
        }
        Insert: {
          adoption_pct?: number
          category?: string
          feature_name: string
          id?: string
          recorded_at?: string
          trend?: string | null
        }
        Update: {
          adoption_pct?: number
          category?: string
          feature_name?: string
          id?: string
          recorded_at?: string
          trend?: string | null
        }
        Relationships: []
      }
      feedback_items: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string
          score: number | null
          sentiment: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          message: string
          score?: number | null
          sentiment?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string
          score?: number | null
          sentiment?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workflow_steps: {
        Row: {
          avg_time: string | null
          completion_pct: number
          id: string
          recorded_at: string
          status: string | null
          step_name: string
        }
        Insert: {
          avg_time?: string | null
          completion_pct?: number
          id?: string
          recorded_at?: string
          status?: string | null
          step_name: string
        }
        Update: {
          avg_time?: string | null
          completion_pct?: number
          id?: string
          recorded_at?: string
          status?: string | null
          step_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
