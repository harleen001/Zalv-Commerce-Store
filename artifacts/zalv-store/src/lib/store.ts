import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import bootsImage from '@/assets/zalv-boots.jpg';
import craftImage from '@/assets/zalv-craft.jpg';
import heroImage from '@/assets/zalv-hero.jpg';
import jacketImage from '@/assets/zalv-jacket.jpg';
import perfumeImage from '@/assets/zalv-perfume.jpg';
import jacket02Image from '@/assets/zalv-jacket-02.jpg';
import jacket03Image from '@/assets/zalv-jacket-03.jpg';
import jacket04Image from '@/assets/zalv-jacket-04.jpg';
import boots02Image from '@/assets/zalv-boots-02.jpg';
import boots03Image from '@/assets/zalv-boots-03.jpg';
import boots04Image from '@/assets/zalv-boots-04.jpg';
import perfume02Image from '@/assets/zalv-perfume-02.jpg';
import perfume03Image from '@/assets/zalv-perfume-03.jpg';
import perfume04Image from '@/assets/zalv-perfume-04.jpg';

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
export type CartItem = { product: Product; quantity: number; size?: string };
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
  items?: OrderItem[];
};
export type OrderItem = { order_id: string; product_id: string; product_name: string; size?: string | null; quantity: number; unit_price: number };
export type CheckoutDetails = Pick<Order, 'customer_name' | 'customer_phone' | 'customer_email' | 'shipping_address' | 'city' | 'pincode'>;
export type Profile = { id: string; full_name: string; email?: string; phone?: string; shipping_address?: string; city?: string; pincode?: string; is_admin?: boolean; created_at?: string };
type LocalUser = { id: string; email: string; password: string; name: string };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Every product gets its own photo. Pools are used as a fallback for any product not listed in productImages.
const imagePools: Record<Product['category'], string[]> = {
  perfume: [perfumeImage, perfume04Image, perfume03Image, perfume02Image],
  shoes: [bootsImage, boots02Image, boots03Image, boots04Image],
  jackets: [jacketImage, jacket03Image, jacket02Image, jacket04Image],
};
const productImages: Record<string, string> = {
  // built-in catalog
  'smoke-and-saffron': perfumeImage, 'monsoon-vetiver': perfume04Image, 'mogra-at-dusk': perfume03Image, 'after-the-rain': perfume02Image,
  'the-jalandhar-boot': bootsImage, 'field-derby': boots02Image, 'blacksmith-buckle': boots03Image, 'night-rider': boots04Image,
  'the-atelier': jacketImage, 'roadhouse': jacket03Image, 'quiet-rider': jacket02Image, 'first-cut': jacket04Image,
  // Supabase seed (supabase/schema.sql)
  'noir-01': perfumeImage, 'sillage-02': perfume03Image, 'mitti-03': perfume02Image, 'salt-04': perfume04Image,
  'moc-01': bootsImage, 'derby-02': boots02Image, 'loafer-03': boots04Image, 'trail-04': boots03Image,
  'rider-02': jacketImage, 'field-01': jacket03Image, 'work-03': jacket02Image, 'flight-04': jacket04Image,
};

export const catalog: Product[] = [
  { id:'p1', slug:'smoke-and-saffron', name:'Smoke / Saffron', category:'perfume', description:'Saffron, burnt cedar, a thread of leather.', price:4850, image_url:perfumeImage, is_featured:true },
  { id:'p2', slug:'monsoon-vetiver', name:'Monsoon Vetiver', category:'perfume', description:'Green vetiver, wet stone, black pepper.', price:4250, image_url:perfume04Image, is_featured:true },
  { id:'p3', slug:'mogra-at-dusk', name:'Mogra at Dusk', category:'perfume', description:'Night jasmine, iris, and warm skin.', price:3900, image_url:perfume03Image, is_featured:false },
  { id:'p4', slug:'after-the-rain', name:'After the Rain', category:'perfume', description:'Petrichor, sandalwood, a clean mineral finish.', price:4500, image_url:perfume02Image, is_featured:false },
  { id:'p5', slug:'the-jalandhar-boot', name:'The Jalandhar Boot', category:'shoes', description:'Full-grain leather. Brass buckle. Built for long roads.', price:12900, image_url:bootsImage, is_featured:true },
  { id:'p6', slug:'field-derby', name:'Field Derby', category:'shoes', description:'A low profile with a little more weather in it.', price:9800, image_url:boots02Image, is_featured:true },
  { id:'p7', slug:'blacksmith-buckle', name:'Blacksmith Buckle', category:'shoes', description:'Hand-finished calfskin with a weighted sole.', price:11600, image_url:boots03Image, is_featured:false },
  { id:'p8', slug:'night-rider', name:'Night Rider', category:'shoes', description:'Black leather, clean lines, no unnecessary noise.', price:10800, image_url:boots04Image, is_featured:false },
  { id:'p9', slug:'the-atelier', name:'The Atelier Jacket', category:'jackets', description:'A precise cut in oxblood leather from Jalandhar.', price:26500, image_url:jacketImage, is_featured:true },
  { id:'p10', slug:'roadhouse', name:'Roadhouse Jacket', category:'jackets', description:'Relaxed shoulders. A strong collar. Made to age.', price:23800, image_url:jacket03Image, is_featured:true },
  { id:'p11', slug:'quiet-rider', name:'Quiet Rider', category:'jackets', description:'Soft black leather and hardware kept to a minimum.', price:24900, image_url:jacket02Image, is_featured:false },
  { id:'p12', slug:'first-cut', name:'First Cut', category:'jackets', description:'The everyday leather jacket, made less ordinary.', price:21900, image_url:jacket04Image, is_featured:false },
];

const readLocal = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) as T; } catch { return fallback; }
};
const writeLocal = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

function resolveImageUrl(imageUrl: string) {
  if (imageUrl === 'perfume') return perfumeImage;
  if (imageUrl === 'boots' || imageUrl === 'shoes') return bootsImage;
  if (imageUrl === 'jacket' || imageUrl === 'jackets') return jacketImage;
  if (imageUrl === 'hero') return heroImage;
  if (imageUrl === 'craft') return craftImage;
  return imageUrl;
}

export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: true });
    if (data?.length) {
      const seen: Record<string, number> = {};
      const generic = ['perfume', 'boots', 'shoes', 'jacket', 'jackets'];
      return (data as Product[]).map((product) => {
        const position = (seen[product.category] = (seen[product.category] ?? -1) + 1);
        const pool = imagePools[product.category];
        // a real image URL saved in the database is always respected; generic keywords get a per-product photo
        const image_url = generic.includes(product.image_url)
          ? productImages[product.slug] ?? pool?.[position % pool.length] ?? resolveImageUrl(product.image_url)
          : resolveImageUrl(product.image_url);
        return { ...product, image_url };
      });
    }
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
  const savedUsers = readLocal<LocalUser[]>('zalv-users', []);
  const saved = savedUsers.find((candidate) => candidate.email === email && candidate.password === password)
    || readLocal<LocalUser | null>('zalv-user', null);
  if (!saved || saved.email !== email || saved.password !== password) throw new Error('No account found with those details.');
  return { id: saved.id || 'local-user', email: saved.email, name: saved.name, isAdmin: saved.email.toLowerCase().includes('admin') };
}

export async function signUp(name: string, email: string, password: string) {
  if (supabase) {
    const result = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (result.error) throw new Error(result.error.message);
    if (result.data.user) return { id: result.data.user.id, email: result.data.user.email || email, name, isAdmin: false };
  }
  const user: LocalUser = { id: `local-user-${Date.now()}`, email, name, password };
  const users = readLocal<LocalUser[]>('zalv-users', []);
  writeLocal('zalv-users', [...users.filter((candidate) => candidate.email !== email), user]);
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

export async function getAllUsers(): Promise<Profile[]> {
  if (supabase) {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) return data as Profile[];
  }
  const users = readLocal<LocalUser[]>('zalv-users', []);
  const fallbackUser = readLocal<LocalUser | null>('zalv-user', null);
  const allUsers = users.length ? users : fallbackUser ? [fallbackUser] : [];
  return allUsers.map((user) => ({
    id: user.id,
    full_name: user.name,
    email: user.email,
    created_at: undefined,
  }));
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
  const orderItems = items.map((item) => ({
    product_id: item.product.id,
    product_name: item.product.name,
    size: item.size || null,
    quantity: item.quantity,
    unit_price: item.product.price,
  }));
  if (supabase) {
    const { data: order, error } = await supabase.from('orders').insert({ ...details, user_id: userId, status: 'confirmed', payment_method: 'cod', total }).select().single();
    if (!error && order) {
      const { data: savedItems, error: itemsError } = await supabase.from('order_items').insert(orderItems.map((item) => ({ ...item, order_id: order.id }))).select();
      if (itemsError) throw new Error(itemsError.message);
      return { ...(order as Order), items: (savedItems || []) as OrderItem[] };
    }
    if (error) throw new Error(error.message);
  }
  const orderId = `ZLV-${Date.now().toString().slice(-7)}`;
  const order: Order = { id: orderId, user_id: userId, ...details, status:'confirmed', payment_method:'cod', total, created_at:new Date().toISOString(), items: orderItems.map((item) => ({ ...item, order_id: orderId })) };
  const orders = readLocal<Order[]>('zalv-orders', []);
  writeLocal('zalv-orders', [order, ...orders]);
  return order;
}

async function attachOrderItems(orders: Order[]): Promise<Order[]> {
  if (!supabase || orders.length === 0) return orders;
  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orders.map((order) => order.id));
  if (!items) return orders;
  const itemsByOrder = (items as OrderItem[]).reduce<Record<string, OrderItem[]>>((grouped, item) => {
    (grouped[item.order_id] ||= []).push(item);
    return grouped;
  }, {});
  return orders.map((order) => ({ ...order, items: itemsByOrder[order.id] || [] }));
}

export async function getOrders(userId?: string): Promise<Order[]> {
  if (supabase && userId) {
    const { data } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending:false });
    if (data) return attachOrderItems(data as Order[]);
  }
  return readLocal<Order[]>('zalv-orders', []).filter((order) => !userId || order.user_id === userId);
}

export async function getAllOrders(): Promise<Order[]> {
  if (supabase) {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending:false });
    if (data) return attachOrderItems(data as Order[]);
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