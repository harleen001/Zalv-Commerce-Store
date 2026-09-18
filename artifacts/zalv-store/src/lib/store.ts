import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import bootsImage from '@/assets/zalv-boots.jpg';
import craftImage from '@/assets/zalv-craft.jpg';
import heroImage from '@/assets/zalv-hero.jpg';
import jacketImage from '@/assets/zalv-jacket.jpg';
import perfumeImage from '@/assets/zalv-perfume.jpg';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'perfume' | 'shoes' | 'jackets';
  description: string;
  price: number;
  image_url: string;
  is_featured: boolean;
};
export type CartItem = { product: Product; quantity: number };
export type Order = {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  pincode: string;
  status: string;
  payment_method: string;
  total: number;
  created_at: string;
};
export type OrderItem = { order_id: string; product_id: string; product_name: string; quantity: number; unit_price: number };
export type CheckoutDetails = Pick<Order, 'customer_name' | 'customer_phone' | 'customer_email' | 'shipping_address' | 'city' | 'pincode'>;
export type Profile = { id: string; full_name: string; email?: string; phone?: string; shipping_address?: string; city?: string; pincode?: string; is_admin?: boolean };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const catalog: Product[] = [
  { id:'p1', slug:'smoke-and-saffron', name:'Smoke / Saffron', category:'perfume', description:'Saffron, burnt cedar, a thread of leather.', price:4850, image_url:perfumeImage, is_featured:true },
  { id:'p2', slug:'monsoon-vetiver', name:'Monsoon Vetiver', category:'perfume', description:'Green vetiver, wet stone, black pepper.', price:4250, image_url:perfumeImage, is_featured:true },
  { id:'p3', slug:'mogra-at-dusk', name:'Mogra at Dusk', category:'perfume', description:'Night jasmine, iris, and warm skin.', price:3900, image_url:perfumeImage, is_featured:false },
  { id:'p4', slug:'after-the-rain', name:'After the Rain', category:'perfume', description:'Petrichor, sandalwood, a clean mineral finish.', price:4500, image_url:perfumeImage, is_featured:false },
  { id:'p5', slug:'the-jalandhar-boot', name:'The Jalandhar Boot', category:'shoes', description:'Full-grain leather. Brass buckle. Built for long roads.', price:12900, image_url:bootsImage, is_featured:true },
  { id:'p6', slug:'field-derby', name:'Field Derby', category:'shoes', description:'A low profile with a little more weather in it.', price:9800, image_url:bootsImage, is_featured:true },
  { id:'p7', slug:'blacksmith-buckle', name:'Blacksmith Buckle', category:'shoes', description:'Hand-finished calfskin with a weighted sole.', price:11600, image_url:bootsImage, is_featured:false },
  { id:'p8', slug:'night-rider', name:'Night Rider', category:'shoes', description:'Black leather, clean lines, no unnecessary noise.', price:10800, image_url:bootsImage, is_featured:false },
  { id:'p9', slug:'the-atelier', name:'The Atelier Jacket', category:'jackets', description:'A precise cut in oxblood leather from Jalandhar.', price:26500, image_url:jacketImage, is_featured:true },
  { id:'p10', slug:'roadhouse', name:'Roadhouse Jacket', category:'jackets', description:'Relaxed shoulders. A strong collar. Made to age.', price:23800, image_url:heroImage, is_featured:true },
  { id:'p11', slug:'quiet-rider', name:'Quiet Rider', category:'jackets', description:'Soft black leather and hardware kept to a minimum.', price:24900, image_url:jacketImage, is_featured:false },
  { id:'p12', slug:'first-cut', name:'First Cut', category:'jackets', description:'The everyday leather jacket, made less ordinary.', price:21900, image_url:craftImage, is_featured:false },
];

const readLocal = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) as T; } catch { return fallback; }
};
const writeLocal = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: true });
    if (data?.length) return data as Product[];
  }
  return catalog;
}

export async function signIn(email: string, password: string) {
  if (supabase) {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error && result.data.user) {
      const profile = await getProfile(result.data.user.id);
      return { id: result.data.user.id, email: result.data.user.email || email, name: result.data.user.user_metadata?.full_name || email.split('@')[0], isAdmin: Boolean(profile?.is_admin) };
    }
    if (result.error) throw new Error(result.error.message);
  }
  const saved = readLocal<{ email: string; password: string; name: string } | null>('zalv-user', null);
  if (!saved || saved.email !== email || saved.password !== password) throw new Error('No account found with those details.');
  return { id: 'local-user', email: saved.email, name: saved.name, isAdmin: saved.email.toLowerCase().includes('admin') };
}

export async function signUp(name: string, email: string, password: string) {
  if (supabase) {
    const result = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (result.error) throw new Error(result.error.message);
    if (result.data.user) return { id: result.data.user.id, email: result.data.user.email || email, name, isAdmin: false };
  }
  const user = { id: 'local-user', email, name, password };
  writeLocal('zalv-user', user);
  return { id: user.id, email, name, isAdmin: email.toLowerCase().includes('admin') };
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
  localStorage.removeItem('zalv-session');
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (supabase) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (data) return data as Profile;
  }
  return readLocal<Profile | null>('zalv-profile', null);
}

export async function updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
  if (supabase) {
    const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
    if (!error && data) return data as Profile;
  }
  const current = { ...readLocal<Profile | null>('zalv-profile', null), ...profile } as Profile;
  writeLocal('zalv-profile', current);
  return current;
}

export async function createOrder(userId: string, details: CheckoutDetails, items: CartItem[]): Promise<Order> {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  if (supabase) {
    const { data: order, error } = await supabase.from('orders').insert({ ...details, user_id: userId, status: 'confirmed', payment_method: 'cod', total }).select().single();
    if (!error && order) {
      const { error: itemsError } = await supabase.from('order_items').insert(items.map((item) => ({ order_id: order.id, product_id: item.product.id, product_name: item.product.name, quantity: item.quantity, unit_price: item.product.price })));
      if (itemsError) throw new Error(itemsError.message);
      return order as Order;
    }
    if (error) throw new Error(error.message);
  }
  const order: Order = { id: `ZLV-${Date.now().toString().slice(-7)}`, user_id: userId, ...details, status:'confirmed', payment_method:'cod', total, created_at:new Date().toISOString() };
  const orders = readLocal<Order[]>('zalv-orders', []);
  writeLocal('zalv-orders', [order, ...orders]);
  return order;
}

export async function getOrders(userId?: string): Promise<Order[]> {
  if (supabase && userId) {
    const { data } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending:false });
    if (data) return data as Order[];
  }
  return readLocal<Order[]>('zalv-orders', []).filter((order) => !userId || order.user_id === userId);
}

export async function getAllOrders(): Promise<Order[]> {
  if (supabase) {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending:false });
    if (data) return data as Order[];
  }
  return readLocal<Order[]>('zalv-orders', []);
}

export async function updateOrderStatus(id: string, status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled') {
  if (supabase) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
  }
  const orders = readLocal<Order[]>('zalv-orders', []);
  writeLocal('zalv-orders', orders.map((order) => order.id === id ? { ...order, status } : order));
}