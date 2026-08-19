export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          plan: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          plan?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          plan?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      qr_codes: {
        Row: {
          active: boolean;
          bg: string | null;
          body_shape: string | null;
          content: string;
          created_at: string;
          destination: string | null;
          eye_shape: string | null;
          fg: string | null;
          frame_style: string | null;
          frame_text: string | null;
          gradient_angle: number | null;
          gradient_color: string | null;
          gradient_type: string | null;
          id: string;
          is_dynamic: boolean;
          logo_url: string | null;
          name: string;
          slug: string | null;
          team_id: string | null;
          template_id: number;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          bg?: string | null;
          body_shape?: string | null;
          content?: string;
          created_at?: string;
          destination?: string | null;
          eye_shape?: string | null;
          fg?: string | null;
          frame_style?: string | null;
          frame_text?: string | null;
          gradient_angle?: number | null;
          gradient_color?: string | null;
          gradient_type?: string | null;
          id?: string;
          is_dynamic?: boolean;
          logo_url?: string | null;
          name?: string;
          slug?: string | null;
          team_id?: string | null;
          template_id?: number;
          type?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          bg?: string | null;
          body_shape?: string | null;
          content?: string;
          created_at?: string;
          destination?: string | null;
          eye_shape?: string | null;
          fg?: string | null;
          frame_style?: string | null;
          frame_text?: string | null;
          gradient_angle?: number | null;
          gradient_color?: string | null;
          gradient_type?: string | null;
          id?: string;
          is_dynamic?: boolean;
          logo_url?: string | null;
          name?: string;
          slug?: string | null;
          team_id?: string | null;
          template_id?: number;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "qr_codes_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      scans: {
        Row: {
          code_id: string;
          device: string | null;
          id: string;
          referrer: string | null;
          scanned_at: string;
        };
        Insert: {
          code_id: string;
          device?: string | null;
          id?: string;
          referrer?: string | null;
          scanned_at?: string;
        };
        Update: {
          code_id?: string;
          device?: string | null;
          id?: string;
          referrer?: string | null;
          scanned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "scans_code_id_fkey";
            columns: ["code_id"];
            isOneToOne: false;
            referencedRelation: "qr_codes";
            referencedColumns: ["id"];
          },
        ];
      };
      team_invites: {
        Row: {
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          invited_by: string;
          role: string;
          status: string;
          team_id: string;
          token: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          expires_at?: string;
          id?: string;
          invited_by: string;
          role?: string;
          status?: string;
          team_id: string;
          token: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          invited_by?: string;
          role?: string;
          status?: string;
          team_id?: string;
          token?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_invites_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      team_members: {
        Row: {
          joined_at: string;
          role: string;
          team_id: string;
          user_id: string;
        };
        Insert: {
          joined_at?: string;
          role?: string;
          team_id: string;
          user_id: string;
        };
        Update: {
          joined_at?: string;
          role?: string;
          team_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      link_pages: {
        Row: {
          created_at: string;
          id: string;
          slug: string;
          subtitle: string | null;
          theme_bg: string;
          theme_color: string;
          theme_font: string;
          title: string;
          updated_at: string;
          user_id: string;
          avatar_url: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          slug: string;
          subtitle?: string | null;
          theme_bg?: string;
          theme_color?: string;
          theme_font?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          slug?: string;
          subtitle?: string | null;
          theme_bg?: string;
          theme_color?: string;
          theme_font?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      link_sections: {
        Row: {
          created_at: string;
          id: string;
          page_id: string;
          sort_order: number;
          title: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          id?: string;
          page_id: string;
          sort_order?: number;
          title?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          id?: string;
          page_id?: string;
          sort_order?: number;
          title?: string;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "link_sections_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "link_pages";
            referencedColumns: ["id"];
          },
        ];
      };
      link_items: {
        Row: {
          created_at: string;
          icon_emoji: string | null;
          icon_url: string | null;
          id: string;
          section_id: string;
          sort_order: number;
          title: string;
          url: string;
          visible: boolean;
        };
        Insert: {
          created_at?: string;
          icon_emoji?: string | null;
          icon_url?: string | null;
          id?: string;
          section_id: string;
          sort_order?: number;
          title?: string;
          url?: string;
          visible?: boolean;
        };
        Update: {
          created_at?: string;
          icon_emoji?: string | null;
          icon_url?: string | null;
          id?: string;
          section_id?: string;
          sort_order?: number;
          title?: string;
          url?: string;
          visible?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "link_items_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "link_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      visitor_counts: {
        Row: {
          count: number;
          day: string;
        };
        Insert: {
          count?: number;
          day: string;
        };
        Update: {
          count?: number;
          day?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_visitor_count: { Args: { p_day: string }; Returns: number };
      get_total_visitor_count: { Args: Record<string, never>; Returns: number };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
