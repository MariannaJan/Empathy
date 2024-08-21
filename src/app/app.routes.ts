import { Routes } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { StoryComponent } from './components/story/story.component';
import { GameboardComponent } from './components/gameboard/gameboard.component';
import { StartComponent } from './components/start/start.component';
import { LibraryComponent } from './components/library/library.component';
import { EditorStoriesComponent } from './components/editor-stories/editor-stories.component';
import { EditorChaptersComponent } from './components/editor-chapters/editor-chapters.component';
import { StoryEditFormComponent } from './components/story-edit-form/story-edit-form.component';
import { ChapterEditFormComponent } from './components/chapter-edit-form/chapter-edit-form.component';
import { storyChaptersResolver, authGuard, storyResolver, storiesResolver, chapterResolver, authUserResolver, authUserGuard } from './app.guards';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';



export const routes: Routes = [
    { path: 'library/story/:storyId/gameboard/:chapterId', component: GameboardComponent },
    {
        path: 'library/story/:storyId', component: StoryComponent,
        resolve: {
            chapters$: storyChaptersResolver,
        }
    },
    {
        path: 'library', component: LibraryComponent, title: 'Library',
        resolve: {
            stories$: storiesResolver,
        }
    },
    {
        path: 'editor', component: EditorComponent, title: 'Editor',
        canActivateChild: [authGuard],
        children: [
            { path: '', redirectTo: 'stories', pathMatch: 'full' },
            {
                path: 'stories/:storyId/chapters/:chapterId', component: ChapterEditFormComponent,
                resolve: {
                    stories$: storiesResolver,
                    chapter$: chapterResolver,
                }
            },
            {
                path: 'stories/:storyId/chapters', component: EditorChaptersComponent,
                resolve: {
                    chapters$: storyChaptersResolver,
                    story$: storyResolver,
                }
            },
            {
                path: 'stories/:storyId', component: StoryEditFormComponent,
                resolve: {
                    story$: storyResolver,
                }
            },
            { path: 'stories', component: EditorStoriesComponent },
            //     { path: 'pages' },
        ]
    },
    { path: 'signin', component: SignInComponent, title: 'SignIn' },
    { path: 'register', component: RegistrationComponent, title: 'Register' },
    {
        path: 'profile', component: UserProfileComponent, title: 'Profile',
        canActivate: [
            authUserGuard
        ],
        resolve: {
            authUser: authUserResolver,
        }
    },
    { path: '', component: StartComponent, title: 'Start' },
];

