function GetTables(p) {
  // initialize tables
  const n = p.length;
  const probOfIndex = p.map((e) => e * n);
  const probOfAlias = p.map(() => 0);
  const alias = p.map((_, i) => i);
  const tables = [[probOfIndex.slice(), probOfAlias.slice(), alias.slice()]];
  const small = [];
  const large = [];
  for (let i = 0; i < n; i += 1) {
    if (probOfIndex[i] < 1) {
      small.push(i);
    } else {
      large.push(i);
    }
  }

  // while small and large are not empty
  while (small.length && large.length) {
    let s = small.pop();
    let l = large.pop();
    alias[s] = l;
    probOfAlias[s] = 1 - probOfIndex[s];
    probOfIndex[l] -= probOfAlias[s];
    if (probOfIndex[l] < 1 - 1e-12) {
      small.push(l);
    } else {
      large.push(l);
    }
    tables.push([probOfIndex.slice(), probOfAlias.slice(), alias.slice()]);
  }

  // avoid numerical errors, but useless for visualization
  // for (const i in small.concat(large)) {
  //   probOfIndex[i] = 1;
  // }

  return tables;
}
