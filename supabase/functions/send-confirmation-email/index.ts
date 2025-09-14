import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuthWebhookPayload {
  user: {
    id: string;
    email: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(hookSecret);
    
    const {
      user,
      email_data,
    } = wh.verify(payload, headers) as AuthWebhookPayload;
    
    const confirmationUrl = `${email_data.site_url}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`;

    const emailResponse = await resend.emails.send({
      from: "Five London <onboarding@resend.dev>",
      to: [user.email],
      subject: "Confirme seu cadastro - Five London",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #000 0%, #333 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px;">Five London</h1>
            <p style="color: #ccc; margin: 10px 0 0 0;">Elegant Companion Services</p>
          </div>
          
          <div style="padding: 40px 20px; background: #fff;">
            <h2 style="color: #333; margin-bottom: 20px;">Bem-vindo à Five London</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Obrigado por se cadastrar em nossa plataforma premium. Para completar seu registro e acessar nossos serviços exclusivos, confirme seu email clicando no botão abaixo:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #000 0%, #333 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold;
                        display: inline-block;">
                Confirmar Email
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              Se você não conseguir clicar no botão, copie e cole este link no seu navegador:<br>
              <a href="${confirmationUrl}" style="color: #666; word-break: break-all;">${confirmationUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Se você não criou esta conta, pode ignorar este email com segurança.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);