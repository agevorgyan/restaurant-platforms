"use server";

export async function submitForm(data: FormData): Promise<void> {
  console.log("Action triggered", data);
}
