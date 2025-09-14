const results = [];

document.querySelectorAll('.PostContent').forEach(post => {
  const img = post.querySelector('img');
  const desc = post.querySelector('.ImageDescription-editable');

  if (img) {
    results.push({
      src: img.src,
      description: desc ? desc.textContent.trim() : '(No description)'
    });
  }
});

console.log('--- Copy This ---\n');
results.forEach(item => {
  console.log(`${item.description}\n${item.src}\n`);
});
