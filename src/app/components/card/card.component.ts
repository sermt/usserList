import { Input, Component } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() user!: User;
}
