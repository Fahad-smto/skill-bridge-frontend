// hooks/useRoleAccess.ts
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/admin.types';

export const useRoleAccess = (allowedRoles: string[]) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
          router.push('/login');
          return;
        }

        const currentUser: IUser = JSON.parse(userStr);
        setUser(currentUser);

        if (currentUser.role !== 'ADMIN') {
          // Redirect to appropriate dashboard
          if (currentUser.role === 'STUDENT') {
            router.push('/dashboard/student');
          } else if (currentUser.role === 'TUTOR') {
            router.push('/dashboard/tutor');
          } else {
            router.push('/');
          }
          return;
        }

        if (allowedRoles.includes(currentUser.role)) {
          setIsAuthorized(true);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Role access error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [allowedRoles, router]);

  return { user, isAuthorized, isLoading };
};