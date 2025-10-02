import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    matcher: [
        // root page
        '/',
        // any locale but exclude static files, API and _next
        '/:locale((?!api|_next|.*\\..*).*)',
    ],
};
