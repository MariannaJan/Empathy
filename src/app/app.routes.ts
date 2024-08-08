import { Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { EditorComponent } from './components/editor/editor.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { StoryEditComponent } from './components/story-edit/story-edit.component';
import { ChapterEditComponent } from './components/chapter-edit/chapter-edit.component';
import { ChapterEditChooserComponent } from './components/chapter-edit/chapter-edit-chooser/chapter-edit-chooser.component';
import { GameboardComponent } from './components/gameboard/gameboard.component';

export const routes: Routes = [
    { path: 'game', component: GameComponent, title: 'Home' },
    { path: 'editor', component: EditorComponent, title: 'Editor' },
    { path: 'chapters/:storyId', component: ChaptersComponent },
    { path: 'story-edit/:storyId', component: StoryEditComponent },
    { path: 'chapter-edit/:chapterId', component: ChapterEditComponent },
    { path: 'chapter-edit-chooser/:chapterId', component: ChapterEditChooserComponent },
    { path: 'gameboard/:chapterId', component: GameboardComponent },
    { path: '', redirectTo: 'game', pathMatch: 'full' },
];