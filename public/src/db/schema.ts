import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  details: jsonb("details").$type<string[]>().default([]),
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  category: text("category").notNull(),
  collection: text("collection").notNull(),
  colors: jsonb("colors").$type<string[]>().default([]),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  stock: integer("stock").default(50),
  featured: boolean("featured").default(false),
  badge: text("badge"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "cascade",
  }),
  productSlug: text("product_slug").notNull(),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "cascade",
  }),
  productSlug: text("product_slug").notNull(),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull(),
  qty: integer("qty").notNull(),
  image: text("image"),
});

export type ProductRow = typeof products.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
