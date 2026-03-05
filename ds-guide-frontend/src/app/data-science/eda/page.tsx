'use client';
import { useEffect } from 'react';

export default function EDAPage() {
    useEffect(() => {
        // Re-run highlight and math render on mount
        if (typeof window !== 'undefined') {
            // @ts-ignore
            if (window.hljs) window.hljs.highlightAll();
            // @ts-ignore
            if (window.renderMathInElement) {
                // @ts-ignore
                window.renderMathInElement(document.body, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false }
                    ],
                    throwOnError: false
                });
            }
        }
    }, []);

    return (
        <>
            <div className="hero">
                <div className="hero-label">Study Guide</div>
                <h1>Exploratory Data Analysis</h1>
                <p>A guided walkthrough of EDA — from first principles to presenting findings.</p>
                <div className="badge-container">
                    <span className="badge badge-blue">Python</span>
                    <span className="badge badge-blue">Pandas</span>
                    <span className="badge badge-blue">Seaborn</span>
                    <span className="badge badge-gray">Data Analysis</span>
                    <span className="badge badge-gray">Statistics</span>
                </div>
            </div>

            <section className="card" id="what-is-eda">
                <h2 className="card-title">What is EDA — and Why Do We Do It?</h2>
                <p className="card-subtitle">EDA is the process of getting to know your data before doing anything serious with it. It's about forming questions and letting the data answer them.</p>

                <h3>When to Use</h3>
                <div className="badge-container">
                    <span className="badge badge-green">Before any modeling</span>
                    <span className="badge badge-green">On any new dataset</span>
                    <span className="badge badge-green">Before drawing conclusions</span>
                </div>

                <h3>Why It Matters</h3>
                <ul>
                    <li>Catch garbage data — missing values, wrong types, outliers — before they corrupt your model</li>
                    <li>Discover patterns or relationships you didn't expect</li>
                    <li>Avoid wrong conclusions from skewed or biased data</li>
                    <li>Save hours of debugging downstream</li>
                </ul>

                <h3>The Core Mindset</h3>
                <p>EDA is not about proving anything. It's about exploring with curiosity. Think of it like a doctor examining a new patient before diagnosing — they observe and run basic tests before prescribing anything.</p>
            </section>

            <section className="card" id="where-eda">
                <h2 className="card-title">Where We Do EDA</h2>
                <p className="card-subtitle">EDA needs an interactive environment where you can run one thing, see the result, and decide what to do next.</p>

                <h3>Primary Tool</h3>
                <p><strong>Jupyter Notebooks</strong> — the industry standard. Run code cell by cell, see charts inline, write notes alongside code.</p>

                <h3>Core Libraries</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Library</th><th>Purpose</th></tr></thead>
                        <tbody>
                            <tr><td><code>pandas</code></td><td>Load and manipulate data — tables, filtering, grouping</td></tr>
                            <tr><td><code>numpy</code></td><td>Math and numerical operations</td></tr>
                            <tr><td><code>matplotlib</code></td><td>Basic plotting (low-level)</td></tr>
                            <tr><td><code>seaborn</code></td><td>Prettier statistical plots built on matplotlib</td></tr>
                            <tr><td><code>scipy / statsmodels</code></td><td>Statistical testing</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3>Uniform Plotting Syntax</h3>
                <p>Use <strong>seaborn</strong> for all charts — it has a consistent API so you don't need to memorize multiple calling conventions:</p>
                <pre><code className="language-python">{"sns.chart_type(data=df, x='column_name')"}</code></pre>

                <div className="callout">
                    <strong>Why not pandas plotting?</strong>
                    <p>Pandas has 3 different inconsistent ways to call charts. Seaborn uses the same pattern for everything. Learn seaborn — you'll still see pandas plotting in the wild, so recognize it, but don't use it yourself.</p>
                </div>
            </section>

            <section className="card" id="structure">
                <h2 className="card-title">Step 1 — Data Shape & Structure</h2>
                <p className="card-subtitle">Before looking at any values, take inventory of what you have. This is your sanity check.</p>

                <h3>Key Questions to Answer</h3>
                <ul>
                    <li>How big is the data? (rows × columns)</li>
                    <li>What are the column names and their data types?</li>
                    <li>Is there missing data? How much and where?</li>
                    <li>Do the values look reasonable at a glance?</li>
                </ul>

                <h3>Column Types</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Type</th><th>Examples</th><th>Also Called</th></tr></thead>
                        <tbody>
                            <tr><td>Numerical</td><td>age, price, temperature</td><td>Quantitative</td></tr>
                            <tr><td>Categorical</td><td>gender, country, product type</td><td>Qualitative</td></tr>
                        </tbody>
                    </table>
                </div>
                <p style={{ marginTop: '0.75rem' }}>These two types are treated completely differently throughout EDA.</p>

                <h3>What to Look For</h3>
                <ul>
                    <li>Columns stored in the wrong type (numbers stored as text)</li>
                    <li>Columns with lots of missing values — maybe useless?</li>
                    <li>Values that seem wildly off (age of 900, negative price)</li>
                    <li>Whether you have the columns you expected</li>
                </ul>

                <pre><code className="language-python">{`df.shape           # (rows, columns)
df.dtypes          # type of each column
df.isnull().sum()  # count of missing values per column
df.head()          # first 5 rows
df.sample(10)      # 10 random rows
df.describe()      # min, max, mean, median, spread for numerical cols`}</code></pre>
            </section>

            <section className="card" id="distributions">
                <h2 className="card-title">Step 2 — Understanding Distributions</h2>
                <p className="card-subtitle">Now you look at what the values inside each column actually look like. This is where you move from tables to visuals.</p>

                <h3>Numerical Columns — Histogram</h3>
                <pre><code className="language-python">{"sns.histplot(data=df, x='age')"}</code></pre>
                <p>What patterns to look for:</p>
                <ul>
                    <li><strong>Normal (bell curve)</strong> — values cluster around the middle. Many statistical tests assume this.</li>
                    <li><strong>Skewed</strong> — tail drags to one side. Common with income, house prices.</li>
                    <li><strong>Bimodal</strong> — two humps. Often means two hidden groups in your data.</li>
                    <li><strong>Uniform</strong> — everything equally spread. Rare in real data.</li>
                </ul>

                <h3>Categorical Columns — Count Plot</h3>
                <pre><code className="language-python">{"sns.countplot(data=df, x='country')"}</code></pre>
                <p>Shows category balance. If 95% of data is one category, that's a problem worth knowing.</p>

                <h3>Boxplot — Summary of a Distribution</h3>
                <pre><code className="language-python">{"sns.boxplot(data=df, x='salary')"}</code></pre>
                <ul>
                    <li><strong>Line in the middle</strong> = median</li>
                    <li><strong>Edges of the box</strong> = 25th and 75th percentile (middle 50% of data)</li>
                    <li><strong>Dots outside whiskers</strong> = outliers</li>
                </ul>

                <div className="callout">
                    <strong>Why does shape matter?</strong>
                    <p>The shape of your distribution determines which statistical tests are valid, whether you need to transform your data, and whether outliers will distort your results.</p>
                </div>
            </section>

            <section className="card" id="relationships">
                <h2 className="card-title">Step 3 — Relationships Between Columns</h2>
                <p className="card-subtitle">The real insights come from asking: do these two things move together? How you explore this depends entirely on the types of the columns involved.</p>

                <h3>Which Chart for Which Combination?</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Relationship</th><th>Example</th><th>Chart</th></tr></thead>
                        <tbody>
                            <tr><td>Numerical vs Numerical</td><td>age vs salary</td><td>Scatter plot</td></tr>
                            <tr><td>Categorical vs Numerical</td><td>country vs salary</td><td>Boxplot</td></tr>
                            <tr><td>Many Numerical at once</td><td>all columns vs all</td><td>Pair plot</td></tr>
                            <tr><td>Numerical correlations (overview)</td><td>full dataset</td><td>Heatmap</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3>Scatter Plot</h3>
                <pre><code className="language-python">{"sns.scatterplot(data=df, x='age', y='salary')"}</code></pre>

                <h3>Boxplot Across Groups</h3>
                <pre><code className="language-python">{"sns.boxplot(data=df, x='country', y='salary')"}</code></pre>

                <h3>Pair Plot</h3>
                <pre><code className="language-python">{"sns.pairplot(df)"}</code></pre>

                <h3>Correlation Heatmap</h3>
                <pre><code className="language-python">{"sns.heatmap(df.corr(), annot=True, cmap='coolwarm')"}</code></pre>
                <p>Color-coded grid of correlation values ranging from <strong>-1 to 1</strong>:</p>
                <ul>
                    <li><strong>1</strong> — they move perfectly together</li>
                    <li><strong>-1</strong> — perfectly opposite movement</li>
                    <li><strong>0</strong> — no relationship</li>
                </ul>
            </section>

            <section className="card" id="findings">
                <h2 className="card-title">Step 4 — Synthesizing & Presenting Findings</h2>
                <p className="card-subtitle">After exploring, you shift from asking questions to telling a story. Findings are only valuable if they lead to clear, actionable insights.</p>

                <h3>Three Questions Every EDA Summary Answers</h3>
                <ol>
                    <li>What did the data look like? (structure, quality, distributions)</li>
                    <li>What patterns or relationships did you find?</li>
                    <li>What does it mean, and what should happen next?</li>
                </ol>

                <h3>Four Layers of Findings</h3>
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Layer</th><th>What Goes Here</th><th>Example</th></tr></thead>
                        <tbody>
                            <tr><td>Data Quality</td><td>Issues found and decisions made</td><td>"Column X had 40% missing values and was dropped"</td></tr>
                            <tr><td>Key Distributions</td><td>Shape of important columns</td><td>"Salary is heavily right-skewed"</td></tr>
                            <tr><td>Relationships</td><td>Notable correlations or group differences</td><td>"Users from Country A spend 2x more than average"</td></tr>
                            <tr><td>Hypotheses</td><td>What to investigate next</td><td>"Worth checking if the age-salary relationship holds within each country"</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="callout">
                    <strong>The Golden Rule</strong>
                    <p>Every chart needs a sentence. Every sentence needs a "so what." A chart with no explanation is decoration. An observation with no implication is trivia.</p>
                </div>
            </section>

        </>
    );
}
