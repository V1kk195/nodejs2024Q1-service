import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from '../../artist/entity/artist.entity';

@Entity()
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column('int')
  year: number;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null; // refers to Artist

  @ManyToOne(() => ArtistEntity, { onDelete: 'SET NULL' })
  artist: ArtistEntity;
}
