"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const role = user.user_metadata?.role;
  if (role !== "do" && role !== "corporate") throw new Error("Unauthorized");
}

export async function inviteUser(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const conceptId = formData.get("concept_id") as string || null;

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: fullName,
      role,
      concept_id: conceptId,
    },
  });

  if (error) throw error;
  revalidatePath("/admin/staff");
}

export async function updateUserRole(userId: string, role: string) {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: existing } = await admin.auth.admin.getUserById(userId);
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...existing?.user?.user_metadata,
      role,
    },
  });

  revalidatePath("/admin/staff");
}

export async function updateUserConcept(userId: string, conceptId: string | null) {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: existing } = await admin.auth.admin.getUserById(userId);
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...existing?.user?.user_metadata,
      concept_id: conceptId,
    },
  });

  revalidatePath("/admin/staff");
}
