import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  readonly translationService = inject(TranslationService);
  
  get t() {
    return this.translationService.t;
  }

  currentYear = new Date().getFullYear();
}
