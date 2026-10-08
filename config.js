// إعدادات الموقع. هذا الملف علني، فلا تضع فيه أي مفتاح سري.
// المسموح فقط: Project URL ومفتاح anon (أو publishable) من Supabase، وهما مصممان ليكونا علنيين وتحميهما قواعد RLS.
// ممنوع تماماً: مفتاح service_role، أو Client Secret الخاص بـ Discord.
window.ALETHEA_CONFIG = {
  SUPABASE_URL: "PASTE_SUPABASE_PROJECT_URL",
  SUPABASE_ANON_KEY: "PASTE_SUPABASE_ANON_KEY",
  DISCORD_INVITE_URL: "PASTE_DISCORD_INVITE_LINK",
  // اختياري: Server ID لإظهار عدد المتصلين (يتطلب تفعيل Widget في إعدادات السيرفر)
  DISCORD_GUILD_ID: "PASTE_SERVER_ID_OR_LEAVE_AS_IS"
};
