import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { EditorComponent } from './components/editor/editor.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'editor', component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
