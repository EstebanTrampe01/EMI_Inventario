import { ApiProperty } from '@nestjs/swagger';

/**
 * Clase para representar una respuesta de consulta paginada.
 *
 * @template T - El tipo de los datos contenidos en la respuesta.
 */
export class QueryResponseDto<T> {
  /**
   * Los datos de la respuesta.
   */
  @ApiProperty({ isArray: true })
  data: T[];

  /**
   * El número total de elementos disponibles.
   */
  @ApiProperty()
  total: number;

  /**
   * El número de la página actual.
   */
  @ApiProperty()
  page: number;

  /**
   * El número máximo de elementos por página.
   */
  @ApiProperty()
  limit: number;

  /**
   * El número total de páginas disponibles.
   */
  @ApiProperty()
  totalPages: number;
}
