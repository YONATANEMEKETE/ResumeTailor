import { auth } from '@/lib/auth';

export const signInWithGoogle = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await auth.api.signInSocial({
      body: {
        provider: 'google',
      },
    });
    return { success: true, message: 'sign in with google successful' };
  } catch (error) {
    console.log(error);
    const e = error as Error;
    return { success: false, message: e.message };
  }
};
