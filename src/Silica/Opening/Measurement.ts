import * as t from 'io-ts';
import { Angle, Distance } from '../../Numbers';

/**
 * A `Measurement` in a particular set of Directions.
 *
 * @category Measurement
 */
export type Measurement<S extends keyof Directed> = MeasureDirection<S> & UndirectedMeasurement;
export const Measurement = <S extends keyof Directed>(s: S): t.Type<Measurement<S>> =>
    t.intersection([
        UndirectedMeasurement,
        MeasureDirection(s),
    ]);

/**
 * The the part of a `Measurement` that specifies the `Direction`.
 *
 * @category Measurement
 */
export interface MeasureDirection<S extends keyof Directed> {
    Direction: Directed[S];
};
export const MeasureDirection = <S extends keyof Directed>(s: S): t.Type<MeasureDirection<S>> =>
    t.interface({
        Direction: Directed(s),
    });

/**
 * Directions
 *
 * We constrain `Measurement`s to be going counter-clockwise around the `Opening`.
 *
 * Things on a particular side or going in a particular direction, may only be
 * measured in particular direcions.
 *
 * @category Measurement
 */
export const Directed = <S extends keyof Directed>(s: S) => new t.Type<Directed[S]>(
    'Directed ' + s,
    (input: unknown): input is Directed[S] => isDirected(s)(input),
    (input, context) => isDirected(s)(input) ? t.success(input) : t.failure(input, context), 
    t.identity,
);
const isDirected = <S extends keyof Directed>(s: S) => (x: unknown): x is Directed[S] =>
    typeof x === 'string' && mapDirected[s].hasOwnProperty(x);
export interface Directed {
  Bottom: 'up' | 'down' | 'right';
  Left: 'down';
  Right: 'up';
  Top: 'up' | 'down' | 'left';
  In: 'in';
  Out: 'out';
};
export const mapDirected: {[k in keyof Directed]: {[d in Directed[k]]: true}} = {
  Bottom: {
      'up': true,
      'down': true,
      'right': true,
  },
  Left: {
      'down': true,
  },
  Right: {
      'up': true,
  },
  Top: {
      'up': true,
      'down': true,
      'left': true,
  },
  In: {
      'in': true,
  },
  Out: {
      'out': true,
  },
};

/**
 * A straight measurement measures the length along a straight line, and the amount of outage.
 *
 * @category Measurement
 */
export const MeasureStraight = t.interface({
    Type: t.literal('straight'),
    Distance: t.union([Distance, t.null]),
    Outage: t.number,
});
export type MeasureStraight = t.TypeOf<typeof MeasureStraight>;

/**
 * An axial measurement measures the plumb or level distance and the other offset.
 *
 * @category Measurement
 */
export const MeasureAxial = t.interface({
    Type: t.literal('axial'),
    Major: t.union([Distance, t.null]),
    Minor: t.number,
});
export type MeasureAxial = t.TypeOf<typeof MeasureAxial>;

/**
 * A bowed measurement measures the plumb or level distance and the amount of bow.
 *
 * @category Measurement
 */
export const MeasureBowed = t.interface({
    Type: t.literal('bowed'),
    Major: t.union([Distance, t.null]),
    Minor: t.number,
});
export type MeasureBowed = t.TypeOf<typeof MeasureBowed>;

/**
 * A round measurement measures the plumb or level distance and the other
 * offset, forming an elliptical curve.
 *
 * @category Measurement
 */
export const MeasureRound = t.interface({
    Type: t.literal('round'),
    Major: t.union([Distance, t.null]),
    Minor: t.number,
});
export type MeasureRound = t.TypeOf<typeof MeasureRound>;

/**
 * An angle measurement measures the plumb or level distance and the angle
 * offset from straight in the current direction.
 *
 * @category Measurement
 */
export const MeasureAngle = t.interface({
    Type: t.literal('angle'),
    Major: t.union([Distance, t.null]),
    Angle: Angle,
});
export type MeasureAngle = t.TypeOf<typeof MeasureAngle>;

/**
 * The measurement part of the `Measurement`, sans direction.
 *
 * @category Measurement
 */
export type UndirectedMeasurement = t.TypeOf<typeof UndirectedMeasurement>;
export const UndirectedMeasurement = t.union([
    MeasureStraight,
    MeasureAngle,
    MeasureAxial,
    MeasureRound,
    MeasureBowed,
]);