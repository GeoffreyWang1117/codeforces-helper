/**
 * Formula parsing test with mock HTML
 * Tests all 7 Codeforces formula formats
 */

const core = require('@cf-dl/core');
const { htmlToMarkdown } = core;

// Sample HTML with various formula formats from Codeforces
const sampleHTML = `
<div class="problem-statement">
  <div class="title">A. Watermelon</div>

  <div class="time-limit">
    <div class="property-title">time limit per test</div>1 second
  </div>

  <div class="memory-limit">
    <div class="property-title">memory limit per test</div>256 megabytes
  </div>

  <div>
    <p>One hot summer day Pete and his friend Billy decided to buy a watermelon.
    They chose the biggest and the ripest one, in their opinion.</p>

    <p>After that the watermelon was weighed, and the scales showed
    <span class="tex-font-size-script">$w$</span> kilos. They rushed home,
    dying of thirst, and decided to divide the berry.</p>

    <p>However they faced the problem: Pete and Billy are great fans of even numbers.
    So they want to divide the watermelon in such a way that each of them gets an even amount.</p>

    <p>For example, if <span class="tex-span">$w = 8$</span>, the watermelon can be divided into
    <span class="tex-span">$4 + 4$</span> or <span class="tex-span">$2 + 6$</span> parts.</p>

    <p>The number of parts should be exactly two and the formula is
    <span class="tex-font-size-script">$a^2 + b^2 = c^2$</span>.</p>

    <p>Using bracket notation: \\(x_1, x_2, \\ldots, x_n\\) and display style:
    \\[\\sum_{i=1}^{n} x_i = \\frac{n(n+1)}{2}\\]</p>

    <p>Triple dollar format: $$$n \\times m$$$ and some inline math with special chars:
    <span class="tex-font-size-script">$\\alpha \\leq \\beta$</span>.</p>

    <p>Code block example: <pre class="prettyprint">for (int i = 0; i &lt; n; i++) {
    sum += arr[i];
}</pre></p>

    <p>Array notation: <span class="tex-span">$a[1..n]$</span> where
    <span class="tex-span">$1 \\le n \\le 10^5$</span>.</p>
  </div>

  <div class="input-specification">
    <div class="section-title">Input</div>
    <p>The first line contains integer <span class="tex-span">$n$</span>
    (<span class="tex-span">$1 \\le n \\le 100$</span>) — the number.</p>
  </div>

  <div class="output-specification">
    <div class="section-title">Output</div>
    <p>Print <span class="tex-font-style-tt">YES</span> if the condition holds.</p>
  </div>
</div>
`;

console.log('🧪 Formula Parsing Test - Mock HTML\n');
console.log('Testing enhanced HTML-to-Markdown converter');
console.log('=' .repeat(60));

try {
  // Test the converter
  console.log('\n📝 Converting HTML to Markdown...');
  const markdown = htmlToMarkdown(sampleHTML);

  console.log('✓ Conversion successful!\n');

  // Display the result
  console.log('📄 Markdown Output:');
  console.log('-'.repeat(60));
  console.log(markdown);
  console.log('-'.repeat(60));

  // Analyze formulas
  console.log('\n📊 Formula Analysis:');

  const patterns = [
    { name: 'Inline LaTeX ($...$)', regex: /\$[^$\n]+\$/g },
    { name: 'Display LaTeX ($$...$$)', regex: /\$\$[^$]+\$\$/g },
    { name: 'Unescaped HTML (<, >)', regex: /[<>](?![a-z])/gi },
    { name: 'HTML entities (&lt;, &gt;)', regex: /&[lg]t;/g },
    { name: 'Math symbols (≤, ≥, ×)', regex: /[≤≥×∑∏]/g },
  ];

  patterns.forEach(({ name, regex }) => {
    const matches = markdown.match(regex);
    const count = matches ? matches.length : 0;
    console.log(`  ${name}: ${count}`);
    if (matches && count <= 5) {
      matches.forEach(m => console.log(`    - "${m}"`));
    }
  });

  // Check for errors
  console.log('\n🔍 Error Detection:');
  const errors = [];

  if (markdown.includes('<span')) {
    errors.push('Found unconverted <span> tags');
  }

  if (markdown.includes('&lt;') || markdown.includes('&gt;')) {
    errors.push('Found unescaped HTML entities');
  }

  if (markdown.includes('$$$$') && !markdown.includes('$$$$ ')) {
    errors.push('Found malformed $$$$ delimiters');
  }

  if (/\\\(|\\\)|\\\[|\\\]/.test(markdown)) {
    errors.push('Found unconverted LaTeX bracket notation');
  }

  if (/\$\$\$[^$]+\$\$\$/.test(markdown)) {
    errors.push('Found unconverted triple-dollar notation');
  }

  if (errors.length > 0) {
    console.log('  ✗ Issues detected:');
    errors.forEach(err => console.log(`    - ${err}`));
  } else {
    console.log('  ✅ No errors detected!');
  }

  // Success summary
  const inlineCount = (markdown.match(/\$[^$\n]+\$/g) || []).length;
  const displayCount = (markdown.match(/\$\$[^$]+\$\$/g) || []).length;

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test Summary:');
  console.log(`  - Inline formulas: ${inlineCount}`);
  console.log(`  - Display formulas: ${displayCount}`);
  console.log(`  - Total formulas: ${inlineCount + displayCount}`);
  console.log(`  - Errors: ${errors.length}`);

  if (errors.length === 0 && (inlineCount + displayCount) > 0) {
    console.log('\n🎉 Formula parsing is working correctly!');
  } else if (errors.length > 0) {
    console.log('\n⚠️  Formula parsing needs improvement');
    process.exit(1);
  }

} catch (error) {
  console.error('\n✗ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
