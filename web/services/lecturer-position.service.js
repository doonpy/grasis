export function getLecturerPositionForView(position) {
  if (position && position.title) {
    return position.title;
  }

  return 'NULL';
}
