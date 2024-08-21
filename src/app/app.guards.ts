import { ActivatedRouteSnapshot, CanActivateFn, ResolveFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from './services/auth-service/auth.service';
import { inject, isDevMode } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ChapterInterface } from './models/chapter.interface';
import { DbService } from './services/db-service/db-service.service';
import { COLLECTION_NAMES } from './services/db-service/db-settings';
import { StoryInterface } from './models/story.interface';
import { User } from 'firebase/auth';


export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        map((user) => ((user && !user.isAnonymous) || isDevMode()) || router.createUrlTree(['/library']))
    );
}

export const authUserGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.user$.pipe(
        map((user) => (user && !user.isAnonymous) || router.createUrlTree(['']))
    );
}

export const authUserResolver: ResolveFn<User | null> = (): Observable<User | null> => {
    const authService = inject(AuthService);
    console.log(`LOL: Running authUser resolver`);
    return authService.user$;
}

export const storyChaptersResolver: ResolveFn<Observable<ChapterInterface[]>> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const dbService = inject(DbService);
    const storyId = route.paramMap.get('storyId');
    console.log(`LOL: Running chapters resolver for StoryId: ${storyId}`);
    const chapters$ = await dbService.getAllCollectionDocs<ChapterInterface>(COLLECTION_NAMES.CHAPTERS);
    return chapters$.pipe(
        map((chapters) => chapters.filter(
            (chapter) => chapter.story_id == storyId
        )
            .sort((a, b) => a.chapter_number - b.chapter_number)
        )
    );
}

export const chapterResolver: ResolveFn<Observable<ChapterInterface> | null> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const dbService = inject(DbService);
    const chapterId = route.paramMap.get('chapterId');
    console.log(`LOL: Running chapter resolver for chapterId: ${chapterId}`);
    return chapterId ? await dbService.getDocumentById<ChapterInterface>(COLLECTION_NAMES.CHAPTERS, chapterId) : null;
}

export const storyResolver: ResolveFn<Observable<StoryInterface> | null> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const dbService = inject(DbService);
    const storyId = route.paramMap.get('storyId');
    console.log(`LOL: Running story resolver for StoryId: ${storyId}`);
    return storyId ? await dbService.getDocumentById<StoryInterface>(COLLECTION_NAMES.STORIES, storyId) : null;
}

export const storiesResolver: ResolveFn<Observable<StoryInterface[]> | null> = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const dbService = inject(DbService);
    console.log(`LOL: Running stories resolver`);
    return await dbService.getAllCollectionDocs<StoryInterface>(COLLECTION_NAMES.STORIES);
}