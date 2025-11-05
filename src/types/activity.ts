// Activity types for tracking admin user actions

export type ActivityType =
  | "post_created"
  | "post_updated"
  | "post_published"
  | "post_deleted"
  | "user_logged_in"
  | "user_logged_out"
  | "testimonial_created"
  | "testimonial_updated"
  | "faq_created"
  | "faq_updated"
  | "settings_updated";

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

