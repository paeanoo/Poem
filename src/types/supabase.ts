export interface Database {
  public: {
    Tables: {
      // 朝代表
      dynasties: {
        Row: {
          id: number
          name: string
          start_year: number | null
          end_year: number | null
          description: string | null
          cultural_background: string | null
          poetry_characteristics: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          start_year?: number | null
          end_year?: number | null
          description?: string | null
          cultural_background?: string | null
          poetry_characteristics?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          start_year?: number | null
          end_year?: number | null
          description?: string | null
          cultural_background?: string | null
          poetry_characteristics?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // 诗人表
      poets: {
        Row: {
          id: number
          name: string
          dynasty_id: number | null
          birth_year: number | null
          death_year: number | null
          biography: string | null
          style: string | null
          representative_works: string[] | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          dynasty_id?: number | null
          birth_year?: number | null
          death_year?: number | null
          biography?: string | null
          style?: string | null
          representative_works?: string[] | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          dynasty_id?: number | null
          birth_year?: number | null
          death_year?: number | null
          biography?: string | null
          style?: string | null
          representative_works?: string[] | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poets_dynasty_id_fkey"
            columns: ["dynasty_id"]
            referencedRelation: "dynasties"
            referencedColumns: ["id"]
          }
        ]
      }
      // 诗词表
      poems: {
        Row: {
          id: number
          title: string
          author_id: number
          dynasty_id: number | null
          content: string[]
          tags: string[] | null
          category: string | null
          difficulty_level: number
          popularity_score: number
          view_count: number
          like_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          author_id: number
          dynasty_id?: number | null
          content: string[]
          tags?: string[] | null
          category?: string | null
          difficulty_level?: number
          popularity_score?: number
          view_count?: number
          like_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          author_id?: number
          dynasty_id?: number | null
          content?: string[]
          tags?: string[] | null
          category?: string | null
          difficulty_level?: number
          popularity_score?: number
          view_count?: number
          like_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poems_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "poets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poems_dynasty_id_fkey"
            columns: ["dynasty_id"]
            referencedRelation: "dynasties"
            referencedColumns: ["id"]
          }
        ]
      }
      // 诗词赏析表
      poem_analyses: {
        Row: {
          id: number
          poem_id: number
          type: string
          background: string | null
          theme: string | null
          techniques: string[] | null
          emotions: string[] | null
          imagery: string[] | null
          translation: string | null
          appreciation: string | null
          ai_generated: boolean
          expert_reviewed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          poem_id: number
          type?: string
          background?: string | null
          theme?: string | null
          techniques?: string[] | null
          emotions?: string[] | null
          imagery?: string[] | null
          translation?: string | null
          appreciation?: string | null
          ai_generated?: boolean
          expert_reviewed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          poem_id?: number
          type?: string
          background?: string | null
          theme?: string | null
          techniques?: string[] | null
          emotions?: string[] | null
          imagery?: string[] | null
          translation?: string | null
          appreciation?: string | null
          ai_generated?: boolean
          expert_reviewed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poem_analyses_poem_id_fkey"
            columns: ["poem_id"]
            referencedRelation: "poems"
            referencedColumns: ["id"]
          }
        ]
      }
      // 诗词分类表
      poem_categories: {
        Row: {
          id: number
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Relationships: []
      }
      // 诗词标签表
      poem_tags: {
        Row: {
          id: number
          name: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Relationships: []
      }
      // 诗词标签关联表
      poem_tag_relations: {
        Row: {
          id: number
          poem_id: number
          tag_id: number
          created_at: string
        }
        Insert: {
          id?: number
          poem_id: number
          tag_id: number
          created_at?: string
        }
        Update: {
          id?: number
          poem_id?: number
          tag_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poem_tag_relations_poem_id_fkey"
            columns: ["poem_id"]
            referencedRelation: "poems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poem_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "poem_tags"
            referencedColumns: ["id"]
          }
        ]
      }
      // 学习记录表
      study_records: {
        Row: {
          id: number
          user_id: string
          poem_id: number
          action: string
          duration: number | null
          progress: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          poem_id: number
          action: string
          duration?: number | null
          progress?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          poem_id?: number
          action?: string
          duration?: number | null
          progress?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_records_poem_id_fkey"
            columns: ["poem_id"]
            referencedRelation: "poems"
            referencedColumns: ["id"]
          }
        ]
      }
      // 用户资料表
      user_profiles: {
        Row: {
          id: string
          username: string | null
          avatar: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // 用户收藏表
      user_collections: {
        Row: {
          id: string
          user_id: string
          poem_id: number
          poem_data: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          poem_id: number
          poem_data: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          poem_id?: number
          poem_data?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collections_poem_id_fkey"
            columns: ["poem_id"]
            referencedRelation: "poems"
            referencedColumns: ["id"]
          }
        ]
      }
      // 诗词点赞表
      poem_likes: {
        Row: {
          id: string
          user_id: string
          poem_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          poem_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          poem_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poem_likes_poem_id_fkey"
            columns: ["poem_id"]
            referencedRelation: "poems"
            referencedColumns: ["id"]
          }
        ]
      }
      // 诗词评论表
      poem_comments: {
        Row: {
          id: string
          poem_id: number
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poem_id: number
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          poem_id?: number
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poem_comments_poem_id_fkey"
            columns: ["poem_id"]
            referencedRelation: "poems"
            referencedColumns: ["id"]
          }
        ]
      }
      // 社区话题表
      community_topics: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          tags: string[] | null
          views: number
          replies: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          tags?: string[] | null
          views?: number
          replies?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          tags?: string[] | null
          views?: number
          replies?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      // 话题回复表
      topic_replies: {
        Row: {
          id: string
          topic_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_replies_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          }
        ]
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

// 用户认证相关类型
export interface AuthUser {
  id: string
  email?: string
  email_confirmed_at?: string | null
  user_metadata?: {
    username?: string
    avatar?: string
  }
}

export interface AuthSession {
  user: AuthUser | null
}

// 收藏相关类型
export interface CollectionItem {
  id: string
  user_id: string
  poem_id: string
  poem_data: Record<string, unknown>
  created_at: string
  updated_at: string
}

// 评论相关类型
export interface PoemComment {
  id: string
  poem_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user_profiles?: {
    username: string | null
    avatar: string | null
  }
}

// 用户资料类型
export interface UserProfile {
  id: string
  username: string | null
  email: string | null
  avatar: string | null
  bio: string | null
  created_at: string
  updated_at: string
}
