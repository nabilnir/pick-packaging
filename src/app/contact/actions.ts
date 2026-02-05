'use server';

import { supabase } from '@/lib/supabase';

export async function submitContactForm(formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const industryType = formData.get('industryType') as string;
    const message = formData.get('message') as string;
    const needs = formData.getAll('needs') as string[];

    const { error } = await supabase.from('contact_submissions').insert([
        {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            industry_type: industryType,
            message: message,
            needs: needs,
        },
    ]);

    if (error) {
        console.error('Error submitting form:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
