import { z } from 'zod';
import { MemberRole } from './types';

export const getMembersListSchema = z.object({ workspaceId: z.string().trim() });

export const patchMemberSchema = z.object({ role: z.nativeEnum(MemberRole) })