

assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scale(10, 5)',
  to: 'scale(20, 9)'
}, [
  {at: -1, is: 'scale(0, 1)'},
  {at: 0, is: 'scale(10, 5)'},
  {at: 0.25, is: 'scale(12.5, 6)'},
  {at: 0.75, is: 'scale(17.5, 8)'},
  {at: 1, is: 'scale(20, 9)'},
  {at: 2, is: 'scale(30, 13)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scaleX(10)',
  to: 'scaleX(20)'
}, [
  {at: -1, is: 'scaleX(0)'},
  {at: 0, is: 'scaleX(10)'},
  {at: 0.25, is: 'scaleX(12.5)'},
  {at: 0.75, is: 'scaleX(17.5)'},
  {at: 1, is: 'scaleX(20)'},
  {at: 2, is: 'scaleX(30)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scaleY(5)',
  to: 'scaleY(9)'
}, [
  {at: -1, is: 'scaleY(1)'},
  {at: 0, is: 'scaleY(5)'},
  {at: 0.25, is: 'scaleY(6)'},
  {at: 0.75, is: 'scaleY(8)'},
  {at: 1, is: 'scaleY(9)'},
  {at: 2, is: 'scaleY(13)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scaleZ(1)',
  to: 'scaleZ(2)'
}, [
  {at: -1, is: 'scaleZ(0)'},
  {at: 0, is: 'scaleZ(1)'},
  {at: 0.25, is: 'scaleZ(1.25)'},
  {at: 0.75, is: 'scaleZ(1.75)'},
  {at: 1, is: 'scaleZ(2)'},
  {at: 2, is: 'scaleZ(3)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scale3d(10, 0.5, 1)',
  to: 'scale3d(20, 1, 2)'
}, [
  {at: -1, is: 'scale3d(0, 0, 0)'},
  {at: 0, is: 'scale3d(10, 0.5, 1)'},
  {at: 0.25, is: 'scale3d(12.5, 0.625, 1.25)'},
  {at: 0.75, is: 'scale3d(17.5, 0.875, 1.75)'},
  {at: 1, is: 'scale3d(20, 1, 2)'},
  {at: 2, is: 'scale3d(30, 1.5, 3)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'none',
  to: 'scale3d(2, 3, 5)'
}, [
  {at: -1, is: 'scale3d(0, -1, -3)'},
  {at: 0, is: 'none'},
  {at: 0.25, is: 'scale3d(1.25, 1.5, 2)'},
  {at: 0.75, is: 'scale3d(1.75, 2.5, 4)'},
  {at: 1, is: 'scale3d(2, 3, 5)'},
  {at: 2, is: 'scale3d(3, 5, 9)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scale3d(2, 3, 5)',
  to: 'none'
}, [
  {at: -1, is: 'scale3d(3, 5, 9)'},
  {at: 0, is: 'scale3d(2, 3, 5)'},
  {at: 0.25, is: 'scale3d(1.75, 2.5, 4)'},
  {at: 0.75, is: 'scale3d(1.25, 1.5, 2)'},
  {at: 1, is: 'none'},
  {at: 2, is: 'scale3d(0, -1, -3)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scaleX(10) scaleY(0.5) scaleZ(1)',
  to: 'scaleX(20) scaleY(1) scaleZ(2)'
}, [
  {at: -1, is: 'scaleX(0) scaleY(0) scaleZ(0)'},
  {at: 0, is: 'scaleX(10) scaleY(0.5) scaleZ(1)'},
  {at: 0.25, is: 'scaleX(12.5) scaleY(0.625) scaleZ(1.25)'},
  {at: 0.75, is: 'scaleX(17.5) scaleY(0.875) scaleZ(1.75)'},
  {at: 1, is: 'scaleX(20) scaleY(1) scaleZ(2)'},
  {at: 2, is: 'scaleX(30) scaleY(1.5) scaleZ(3)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'skewX(10rad) scaleZ(1)',
  to: 'skewX(20rad) scaleZ(2)'
}, [
  {at: -1, is: 'skewX(0rad) scaleZ(0)'},
  {at: 0, is: 'skewX(10rad) scaleZ(1)'},
  {at: 0.25, is: 'skewX(12.5rad) scaleZ(1.25)'},
  {at: 0.75, is: 'skewX(17.5rad) scaleZ(1.75)'},
  {at: 1, is: 'skewX(20rad) scaleZ(2)'},
  {at: 2, is: 'skewX(30rad) scaleZ(3)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'skewX(10rad)',
  to: 'skewX(20rad) scaleZ(2)'
}, [
  {at: -1, is: 'matrix3d(1, 0, 0, 0, -0.940439289306569, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1)'},
  {at: 0, is: 'skewX(10rad)'},
  {at: 0.25, is: 'matrix3d(1, 0, 0, 0, 1.0455608566505006, 1, 0, 0, 0, 0, 1.25, 0, 0, 0, 0, 1)'},
  {at: 0.75, is: 'matrix3d(1, 0, 0, 0, 1.8399609150333283, 1, 0, 0, 0, 0, 1.75, 0, 0, 0, 0, 1)'},
  {at: 1, is: 'skewX(20rad) scaleZ(2)'},
  {at: 2, is: 'matrix3d(1, 0, 0, 0, 3.825961060990398, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'scaleZ(3) perspective(400px)',
  to: 'scaleZ(4) skewX(1rad) perspective(500px)'
}, [
  {at: -1, is: 'matrix3d(1, 0, 0, 0, -1.5574077246549023, 1, 0, 0, 0, 0, 2, -0.002333333333333333, 0, 0, 0, 1)'},
  {at: 0, is: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, -0.0025, 0, 0, 0, 1)'},
  {at: 0.25, is: 'matrix3d(1, 0, 0, 0, 0.3893519311637256, 1, 0, 0, 0, 0, 3.25, -0.0024375, 0, 0, 0, 1)'},
  {at: 0.75, is: 'matrix3d(1, 0, 0, 0, 1.1680557934911766, 1, 0, 0, 0, 0, 3.75, -0.0021874999999999998, 0, 0, 0, 1)'},
  {at: 1, is: 'matrix3d(1, 0, 0, 0, 1.5574077246549023, 1, 0, 0, 0, 0, 4, -0.002, 0, 0, 0, 1)'},
  {at: 2, is: 'matrix3d(1, 0, 0, 0, 3.1148154493098046, 1, 0, 0, 0, 0, 5, -0.0008333333333333337, 0, 0, 0, 1)'},
]);
assertInterpolation({
  property: 'transform',
  prefixedProperty: ['-webkit-transform'],
  from: 'translateY(70%) scaleZ(1)',
  to: 'translateY(90%) scaleZ(2)'
}, [
  {at: -1, is: 'translateY(50%) scaleZ(0)'},
  {at: 0, is: 'translateY(70%) scaleZ(1)'},
  {at: 0.25, is: 'translateY(75%) scaleZ(1.25)'},
  {at: 0.75, is: 'translateY(85%) scaleZ(1.75)'},
  {at: 1, is: 'translateY(90%) scaleZ(2)'},
  {at: 2, is: 'translateY(110%) scaleZ(3)'},
]);
// FIXME: This test case does not work because we don't support non-px lengths
// in matrix decompositions.
// assertInterpolation({
//   property: 'transform',
//   from: 'translateY(70%)',
//   to: 'translateY(90%) scaleZ(2)'
// }, [
//   {at: -1, is: 'translateY(50%) scaleZ(0)'},
//   {at: 0, is: 'translateY(70%)'},
//   {at: 0.25, is: 'translateY(75%) scaleZ(1.25)'},
//   {at: 0.75, is: 'translateY(85%) scaleZ(1.75)'},
//   {at: 1, is: 'translateY(90%) scaleZ(2)'},
//   {at: 2, is: 'translateY(110%) scaleZ(3)'},
// ]);
