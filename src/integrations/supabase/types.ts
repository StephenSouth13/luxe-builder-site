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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_section: {
        Row: {
          created_at: string | null
          description: string
          headline: string
          id: string
          image_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          headline?: string
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          headline?: string
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          category_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          published: boolean | null
          slug: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          slug?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          slug?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_training: {
        Row: {
          active: boolean | null
          answer: string
          created_at: string
          id: string
          keywords: string[]
          language: string
          priority: number | null
          question: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          answer: string
          created_at?: string
          id?: string
          keywords: string[]
          language?: string
          priority?: number | null
          question: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          answer?: string
          created_at?: string
          id?: string
          keywords?: string[]
          language?: string
          priority?: number | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          seen: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          seen?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          seen?: boolean | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          location: string | null
          map_embed_url: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          location?: string | null
          map_embed_url?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          location?: string | null
          map_embed_url?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      education: {
        Row: {
          achievements: string[] | null
          created_at: string | null
          degree: string
          description: string | null
          field: string | null
          id: string
          institution: string
          sort_order: number | null
          updated_at: string | null
          year: string
        }
        Insert: {
          achievements?: string[] | null
          created_at?: string | null
          degree: string
          description?: string | null
          field?: string | null
          id?: string
          institution: string
          sort_order?: number | null
          updated_at?: string | null
          year: string
        }
        Update: {
          achievements?: string[] | null
          created_at?: string | null
          degree?: string
          description?: string | null
          field?: string | null
          id?: string
          institution?: string
          sort_order?: number | null
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          achievements: string[] | null
          company: string
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          achievements?: string[] | null
          company: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          achievements?: string[] | null
          company?: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          created_at: string | null
          id: string
          label: string
          section: string
          sort_order: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          section: string
          sort_order?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          section?: string
          sort_order?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      hero_section: {
        Row: {
          background_image_url: string | null
          created_at: string | null
          id: string
          name: string
          profile_image_url: string | null
          quote: string
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          profile_image_url?: string | null
          quote?: string
          title?: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          profile_image_url?: string | null
          quote?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          challenge: string | null
          created_at: string | null
          description: string
          featured: boolean | null
          full_description: string | null
          id: string
          image_url: string | null
          link: string | null
          metrics: Json | null
          slug: string | null
          solution: string | null
          sort_order: number | null
          technologies: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          challenge?: string | null
          created_at?: string | null
          description: string
          featured?: boolean | null
          full_description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          metrics?: Json | null
          slug?: string | null
          solution?: string | null
          sort_order?: number | null
          technologies?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          challenge?: string | null
          created_at?: string | null
          description?: string
          featured?: boolean | null
          full_description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          metrics?: Json | null
          slug?: string | null
          solution?: string | null
          sort_order?: number | null
          technologies?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          id: string
          provider: string
          sort_order: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider: string
          sort_order?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          provider?: string
          sort_order?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
