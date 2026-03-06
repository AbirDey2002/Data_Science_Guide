'use client';
import { useEffect } from 'react';

function renderMath() {
    if (typeof window === 'undefined') return;
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
    } else {
        setTimeout(renderMath, 100);
    }
}

export default function ZsCaseStudyPage() {
    useEffect(() => {
        // @ts-ignore
        if (window.hljs) window.hljs.highlightAll();
        renderMath();
    }, []);

    return (
        <div className="zs-container">

            {/* ── HERO ── */}
            <div className="hero">
                <div className="hero-eyebrow">Interview Prep — Talking Points</div>
                <h1>ZS Discount Strategy<br />ML Pipeline</h1>
                <p className="subtitle">Everything you need to walk an interviewer through this end-to-end personalization system — what you did, why you did it, and what it means.</p>
                <div className="badge-row">
                    <span className="badge">Gradient Boosting</span>
                    <span className="badge">Binary Classification</span>
                    <span className="badge">Budget Optimization</span>
                    <span className="badge">RFM Segmentation</span>
                    <span className="badge">AUC 0.851</span>
                    <span className="badge">3.5× ROI</span>
                </div>
            </div>

            {/* ── PROBLEM STATEMENT ── */}
            <section className="topic-card" id="problem">
                <div className="card-eyebrow">Section 01</div>
                <h2>Problem Statement</h2>
                <p>A restaurant chain wants to <strong>increase customer visit frequency</strong> using a loyalty challenge: customers who visit N times (the VNR — Visits to Next Reward) within a period earn a reward of a certain dollar value. The goal is to assign each of 5,000 customers a personalized (VNR, Reward_Value) combination that maximizes visit uplift under a <strong>$240,000/month budget</strong>.</p>

                <div className="talking-point">
                    <p>&ldquo;The problem is a constrained personalization problem — we have a discrete set of treatment options (4 VNR levels × 9 reward values = 36 combos), a fixed budget, and we want to maximize the expected business value across all 5,000 customers. The pipeline has three stages: understand the customer base through EDA and RFM, train a model to predict challenge completion probability using pilot data, and then use that model to score every customer on every combo and assign the best one within budget.&rdquo;</p>
                </div>

                <div className="stat-grid">
                    <div className="stat-card"><span className="stat-val">5,000</span><span className="stat-label">Total Customers</span></div>
                    <div className="stat-card"><span className="stat-val">36</span><span className="stat-label">Combos per Customer</span></div>
                    <div className="stat-card"><span className="stat-val">$240K</span><span className="stat-label">Monthly Budget</span></div>
                </div>
            </section>

            {/* ── PIPELINE ── */}
            <section className="topic-card" id="pipeline">
                <div className="card-eyebrow">Section 02</div>
                <h2>Full Pipeline Architecture</h2>
                <div className="code-wrap">
                    <div className="code-label">Pipeline Flow <span className="code-purpose">High-level architecture</span></div>
                    <pre><code className="language-plaintext">{`Orders CSV (58K rows)
    ↓
[CELL 3] EDA → Visit tiers, churn by tier, spend distribution
    ↓
[CELL 4] RFM Segmentation → R, F, M scores (1–5) + segment labels
    ↓
[CELL 5] Pilot Experiment → 800 customers, 1 row/customer, Completed = 0/1
    ↓
[CELL 6] GBM Model → Trained on 7 features, outputs P(completion)
    ↓
[CELL 7] Score 180,000 rows → all customers × all 36 combos
    ↓
[CELL 8] Budget Assignment → greedy net-value maximization under $240K
    ↓
[CELL 9] Evaluation → ML vs Random Pilot comparison
    ↓
[CELL 10] Output → final_output.csv (Customer_ID, VNR, Reward_Value)`}</code></pre>
                    <div className="code-summary"><strong>What to say:</strong> &ldquo;Each cell has one job. EDA informs features. RFM creates interpretable segments and numeric scores that feed the model. The pilot provides labeled training data. The model generalizes what it learned to score combinations it never saw in training. The greedy assignment enforces the business budget constraint.&rdquo;</div>
                </div>
            </section>

            {/* ── EDA ── */}
            <section className="topic-card" id="eda">
                <div className="card-eyebrow">Section 03 — Cell 3</div>
                <h2>EDA + Visit Tier Analysis</h2>
                <div className="code-wrap">
                    <div className="code-label">Python — Cell 3 <span className="code-purpose">Per-customer aggregation + tier labeling</span></div>
                    <pre><code className="language-python">{`cust_summary = orders.groupby('Customer_ID').agg(
    Visit_Count   = ('Order_ID', 'count'),
    Total_Spend   = ('Order_Amount', 'sum'),
    Avg_Order_Val = ('Order_Amount', 'mean'),
    Last_Visit    = ('Order_Date', 'max'),
    First_Visit   = ('Order_Date', 'min')
).reset_index()

# K-Means binning into 5 tiers (data-driven, no hardcoded percentiles)
kbins = KBinsDiscretizer(n_bins=5, encode='ordinal', strategy='kmeans')
cust_summary['Visit_Tier'] = kbins.fit_transform(cust_summary[['Visit_Count']])
tier_map = {0: 'One-Timer', 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Power'}`}</code></pre>
                    <div className="code-summary"><strong>What this does:</strong> Collapses 58K transaction rows into 5,000 customer-level records. Uses K-Means binning (not fixed percentile cuts) so tier boundaries adapt to the actual distribution of visit counts. <strong>Why K-Means over qcut?</strong> qcut forces equal-sized buckets regardless of natural clusters; K-Means finds where the data actually breaks.</div>
                </div>

                <div className="findings-panel">
                    <div className="findings-header">Key EDA Findings — 3 Charts</div>
                    <ul className="findings-list">
                        <li><strong>Visit Frequency Distribution:</strong> Right-skewed. Most customers visited 1–5 times. A small power-user tail visits 20–50 times. This means a uniform reward strategy wastes money on loyal customers and leaves churned ones untouched.</li>
                        <li><strong>Total Spend by Visit Tier:</strong> Power users spend 5× more than One-Timers. Visit frequency is a strong proxy for customer value — justifies using it as a model feature.</li>
                        <li><strong>Churn Rate by Tier:</strong> One-Timers have ~40% churn. Power users near 0%. Critical insight: your most valuable customers don&apos;t need big incentives; your at-risk ones need a nudge, not a $160 reward.</li>
                    </ul>
                </div>

                <div className="talking-point">
                    <p>&ldquo;The EDA told us the customer base is highly heterogeneous — that&apos;s the fundamental justification for personalization. If all customers behaved the same, a single combo would be fine. The churn chart specifically told us that One-Timers are hard to reactivate, so we should be conservative with reward spend on them.&rdquo;</p>
                </div>
            </section>

            {/* ── RFM ── */}
            <section className="topic-card" id="rfm">
                <div className="card-eyebrow">Section 04 — Cell 4</div>
                <h2>RFM Segmentation</h2>
                <div className="code-wrap">
                    <div className="code-label">Python — Cell 4 <span className="code-purpose">RFM scoring + rule-based segment labels</span></div>
                    <pre><code className="language-python">{`rfm = orders.groupby('Customer_ID').agg(
    Recency   = ('Order_Date', lambda x: (rfm_ref - x.max()).days),
    Frequency = ('Order_ID', 'count'),
    Monetary  = ('Order_Amount', 'sum')
).reset_index()

# Score 1-5 per dimension (5 = best)
rfm['R'] = pd.qcut(rfm['Recency'], 5, labels=[5,4,3,2,1]).astype(int)  # reversed
rfm['F'] = pd.qcut(rfm['Frequency'].rank(method='first'), 5, labels=[1,2,3,4,5]).astype(int)
rfm['M'] = pd.qcut(rfm['Monetary'].rank(method='first'),  5, labels=[1,2,3,4,5]).astype(int)

def rfm_label(r):
    if r['R']>=4 and r['F']>=4 and r['M']>=4: return 'Champions'
    if r['R']>=3 and r['F']>=3:               return 'Loyal'
    if r['R']>=4 and r['F']<=2:               return 'New_Customers'
    if r['R']<=2 and r['F']>=3:               return 'At_Risk'
    ...`}</code></pre>
                    <div className="code-summary"><strong>What this does:</strong> Creates R, F, M as numeric scores (1–5) that become model features. The labels are for business interpretation only. Note: R is <em>inverted</em> — lower days since last visit is better, so it maps to score 5. <strong>Why rank() before qcut for F and M?</strong> To handle ties consistently.</div>
                </div>

                <div className="findings-panel">
                    <div className="findings-header">RFM Segmentation Findings</div>
                    <ul className="findings-list">
                        <li><strong>Largest segment is Lost (1,211)</strong> — these are customers who haven&apos;t visited recently and visit infrequently. They need a separate win-back strategy, not high-value challenges.</li>
                        <li><strong>Champions + Loyal = 2,267 customers</strong> — nearly half the base. These customers have demonstrated loyalty and should receive higher reward values since their completion probability is high.</li>
                        <li><strong>Frequency vs Spend scatter (log scale):</strong> Strong positive correlation across all segments. Champions cluster top-right. This validates that F and M scores are meaningful for the model.</li>
                        <li><strong>R, F, M become numeric features</strong> fed directly into the GBM model — bridging business segmentation and ML feature engineering.</li>
                    </ul>
                </div>

                <div className="talking-point">
                    <p>&ldquo;I used RFM because it gives me both business interpretability and numeric features in one step. The segment labels help stakeholders understand the strategy — &apos;Champions get higher rewards&apos; is easy to explain. But the R, F, M scores are what actually go into the model. It&apos;s doing double duty.&rdquo;</p>
                </div>
            </section>

            {/* ── PILOT ── */}
            <section className="topic-card" id="pilot">
                <div className="card-eyebrow">Section 05 — Cell 5</div>
                <h2>Pilot Experiment — Data Structure</h2>
                <div className="code-wrap">
                    <div className="code-label">Python — Cell 5 <span className="code-purpose">Aggregate pilot transactions → 1 row per customer</span></div>
                    <pre><code className="language-python">{`cust_pilot = pilot.groupby(['Customer_ID', 'VNR', 'Reward_Value']).agg(
    Pilot_Visits   = ('Gross_Sales', lambda x: (x > 0).sum()),
    Pilot_Revenue  = ('Gross_Sales', 'sum'),
    Completed      = ('Discount_Amount', lambda x: (x > 0).any())
    # Discount_Amount > 0 means they hit VNR → reward was applied
).reset_index()`}</code></pre>
                    <div className="code-summary"><strong>Key decision — using Discount_Amount as completion signal:</strong> The discount is only applied when a customer visits exactly VNR times. A non-zero discount_amount is an objective, unambiguous signal that the challenge was completed. No manual labeling needed. <strong>Result after aggregation:</strong> 1,698 transaction rows → 800 customer rows, one per customer since each was assigned exactly one (VNR, RV) combo in the pilot.</div>
                </div>

                <div className="findings-panel">
                    <div className="findings-header">Pilot Results — Key Findings</div>
                    <ul className="findings-list">
                        <li><strong>VNR=3 → 31% completion, VNR=6 → 2% completion.</strong> A 15× dropoff. VNR is by far the dominant lever for driving challenge completion. Making the challenge achievable matters more than the reward size.</li>
                        <li><strong>VNR=3 / Reward=$10 had 43% completion</strong> — the single highest cell. Customers will complete a 3-visit challenge for just $10. The incentive threshold is low when the goal is easy.</li>
                        <li><strong>VNR=6 row is almost entirely 0%.</strong> Requiring 6 visits in a period is too demanding for most customers. The few who complete it likely would have visited anyway.</li>
                        <li><strong>Random assignment in the pilot = no selection bias.</strong> This is critical — the model can be trained without worrying that loyal customers were given easier challenges.</li>
                    </ul>
                </div>

                <div className="gotcha"><strong>Training set size:</strong> 800 rows is small for GBM. Each of the 36 (VNR, RV) cells gets on average only 800/36 ≈ 22 customers. Some cells show 0% completion — model must interpolate across sparse cells. This is a known limitation.</div>

                <div className="talking-point">
                    <p>&ldquo;The pilot was randomly assigned, which is important — it means the training data has no selection bias. We can treat VNR and Reward_Value as features the model can generalize from. The main finding was that VNR drives completion far more than reward size, which the feature importance chart later confirmed.&rdquo;</p>
                </div>
            </section>

            {/* ── MODEL IO ── */}
            <section className="topic-card" id="model-io">
                <div className="card-eyebrow">Section 06 — Cell 6</div>
                <h2>Model Inputs and Output</h2>
                <table className="data-table">
                    <thead><tr><th>Feature</th><th>Type</th><th>Importance</th><th>Business Reason</th></tr></thead>
                    <tbody>
                        <tr><td>Avg_Order_Val</td><td>Float</td><td>0.433 ★</td><td>High spenders per visit are regulars — they hit VNR=3 naturally</td></tr>
                        <tr><td>VNR</td><td>Integer 3–6</td><td>0.194</td><td>Treatment: how hard is the challenge? Lower = easier</td></tr>
                        <tr><td>Avg_Monthly_Visits</td><td>Float</td><td>0.168</td><td>Raw visit rate — most direct predictor of challenge feasibility</td></tr>
                        <tr><td>R (Recency score)</td><td>Ordinal 1–5</td><td>0.098</td><td>Recently active customers more likely to complete</td></tr>
                        <tr><td>F (Frequency score)</td><td>Ordinal 1–5</td><td>0.057</td><td>Visit habit — habitual visitors find low VNR easy</td></tr>
                        <tr><td>Reward_Value</td><td>Integer 10–160</td><td>0.038</td><td>Treatment: incentive size. Surprisingly low importance.</td></tr>
                        <tr><td>M (Monetary score)</td><td>Ordinal 1–5</td><td>0.011</td><td>Spend level — weakest predictor of completion</td></tr>
                    </tbody>
                </table>

                <p><strong>Output:</strong> A single float in [0,1] — the probability that this customer completes the challenge under this (VNR, Reward) combination. Binary classification task: Completed ∈ {'{0, 1}'}.</p>

                <div className="success-note">Key insight: VNR and Reward_Value are included as model <em>inputs</em>, not just context. This means the same trained model can score customer C001 under VNR=3/$40 AND VNR=5/$100 — enabling the full 36-combo scoring step without retraining.</div>

                <div className="talking-point">
                    <p>&ldquo;The most important design choice was including VNR and Reward_Value as features. In a typical model, these would be fixed. Here they&apos;re treatment variables — by varying them as inputs, one model can predict the counterfactual outcome for each customer under any combination we might assign.&rdquo;</p>
                </div>
            </section>

            {/* ── LOSS ── */}
            <section className="topic-card" id="loss">
                <div className="card-eyebrow">Section 07 — Loss Function</div>
                <h2>Loss Function: Binary Cross-Entropy</h2>

                <div className="formula-block">
                    {String.raw`$$\mathcal{L} = -\frac{1}{N}\sum_{i=1}^{N}\left[y_i \log \hat{p}_i + (1 - y_i)\log(1-\hat{p}_i)\right]$$`}
                    <p className="formula-label">y_i = actual label (0 or 1), p̂_i = predicted probability, N = number of training samples</p>
                </div>

                <div className="code-wrap">
                    <div className="code-label">Intuition <span className="code-purpose">What the loss penalizes</span></div>
                    <pre><code className="language-python">{`# If customer DID complete (y=1):
#   Loss = -log(p̂)  →  high if we predicted low probability → penalized
#   Loss = 0        →  if p̂ = 1.0 (perfect)

# If customer did NOT complete (y=0):
#   Loss = -log(1-p̂)  →  high if we predicted high probability → penalized

# Why this matters for us:
# Expected_Cost = P_complete × Reward_Value
# If P is miscalibrated (0.9 when true rate is 0.3), budget math breaks.
# Log-loss enforces calibrated probabilities — not just ranking.`}</code></pre>
                    <div className="code-summary"><strong>Why not accuracy?</strong> If completion rate is ~15%, predicting &ldquo;never completes&rdquo; gives 85% accuracy — useless. Log-loss works on probability outputs and is robust to class imbalance. <strong>Why not MSE?</strong> MSE treats classification as regression. Log-loss is the natural loss for Bernoulli probability estimation — theoretically grounded.</div>
                </div>

                <div className="talking-point">
                    <p>&ldquo;I used log-loss because I needed well-calibrated probabilities, not just rankings. The downstream budget math multiplies P(completion) by Reward_Value to get expected cost. If the probability is inflated by a factor of 2, I&apos;d systematically under-estimate costs and blow the budget. Log-loss directly optimizes for calibration.&rdquo;</p>
                </div>
            </section>

            {/* ── OPTIMIZER ── */}
            <section className="topic-card" id="optimizer">
                <div className="card-eyebrow">Section 08 — Optimizer</div>
                <h2>How GBM Optimizes: Gradient Descent in Function Space</h2>
                <div className="code-wrap">
                    <div className="code-label">GBM Mechanics <span className="code-purpose">What happens each boosting iteration</span></div>
                    <pre><code className="language-python">{`# Each tree fits the NEGATIVE GRADIENT of log-loss (pseudo-residuals):
# r_i = y_i - p̂_i    ← how wrong the current model is for sample i

# New tree h_m(x) is fit to these residuals
# Model update:
# F_m(x) = F_{m-1}(x) + learning_rate × h_m(x)

# Hyperparameter choices and WHY:
model = GradientBoostingClassifier(
    n_estimators=200,   # 200 sequential trees — enough for 800 rows
    max_depth=3,        # shallow trees = weak learners, reduces overfitting
    learning_rate=0.05, # small steps = shrinkage regularization
    subsample=0.8,      # 80% row sampling per tree = stochastic GBM (reduces variance)
    random_state=42
)`}</code></pre>
                    <div className="code-summary"><strong>Key difference from neural nets:</strong> Neural nets do gradient descent in <em>parameter space</em> (update weights). GBM does gradient descent in <em>function space</em> — each tree IS the gradient step. No backprop, no learning rate schedule needed in the same way. <strong>All 4 hyperparameters are regularization choices</strong> — deliberately constraining the model because training size is small.</div>
                </div>

                <div className="talking-point">
                    <p>&ldquo;GBM doesn&apos;t update parameters like a neural net. Instead, each tree is fit to the residuals of the previous ensemble — that&apos;s gradient descent in function space. The model grows by 200 shallow trees, each correcting what the previous 199 got wrong. The shallow depth and low learning rate are both there to prevent the 200 trees from memorizing 800 training examples.&rdquo;</p>
                </div>
            </section>

            {/* ── EVALUATION ── */}
            <section className="topic-card" id="eval">
                <div className="card-eyebrow">Section 09 — Evaluation</div>
                <h2>Three Evaluation Metrics — Why All Three</h2>
                <div className="code-wrap">
                    <div className="code-label">Python — Cell 6 Evaluation <span className="code-purpose">5-fold out-of-fold evaluation</span></div>
                    <pre><code className="language-python">{`cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Out-of-fold predictions — honest evaluation, not training score
y_prob_cv = cross_val_predict(model, X, y, cv=cv, method='predict_proba')[:, 1]

auc = roc_auc_score(y, y_prob_cv)    # 0.851
ll  = log_loss(y, y_prob_cv)         # 0.324
bs  = brier_score_loss(y, y_prob_cv) # 0.098`}</code></pre>
                    <div className="code-summary"><strong>Why out-of-fold (not train score)?</strong> With 800 rows, a single train/test split has high variance. 5-fold ensures every sample is tested exactly once on data the model never saw. <strong>Stratified</strong> = each fold preserves the class imbalance ratio (important when positive rate is ~15–30%).</div>
                </div>

                <table className="data-table">
                    <thead><tr><th>Metric</th><th>Value</th><th>Baseline</th><th>What It Tests</th></tr></thead>
                    <tbody>
                        <tr><td>AUC-ROC</td><td>0.851</td><td>0.50 (random)</td><td>Ranking quality — can model separate completers from non-completers?</td></tr>
                        <tr><td>Log Loss</td><td>0.324</td><td>~0.45 (predict mean)</td><td>Probability calibration — are predicted probabilities accurate?</td></tr>
                        <tr><td>Brier Score</td><td>0.098</td><td>~0.25 (random)</td><td>MSE of probabilities — combined accuracy + calibration</td></tr>
                    </tbody>
                </table>

                <div className="talking-point">
                    <p>&ldquo;I used three metrics because they test different things. AUC tells me if the model ranks customers correctly — useful for prioritization. Log-loss and Brier score tell me if the probabilities themselves are trustworthy. Since I&apos;m using P(completion) directly in budget math, calibration matters as much as ranking. An AUC of 0.85 means the model correctly ranks 85% of customer pairs by completion likelihood.&rdquo;</p>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="topic-card" id="features">
                <div className="card-eyebrow">Section 10 — Feature Engineering</div>
                <h2>Why Avg_Order_Val Dominates (0.433)</h2>
                <p>This is the most interesting and potentially concerning finding. Avg_Order_Val is a <strong>customer-level feature</strong> that reflects their inherent visit behavior — not how they respond to a specific offer.</p>

                <div className="gotcha"><strong>Confounding risk:</strong> High-AOV customers might be completing the challenge not because of the incentive, but because they visit 3× per period anyway. The model is capturing correlation, not necessarily causal response to the offer. An uplift model would separate &ldquo;would visit anyway&rdquo; from &ldquo;visits because of offer.&rdquo;</div>

                <div className="talking-point">
                    <p>&ldquo;The fact that Avg_Order_Val dominates at 0.43 tells me the model is mostly identifying who is a good customer, not who responds well to a specific offer. That&apos;s useful for targeting spend, but it also means we might be assigning premium rewards to customers who would have completed the challenge for free. Ideally we&apos;d complement this with an uplift model to measure the incremental effect of the offer.&rdquo;</p>
                </div>
            </section>

            {/* ── SCORING ── */}
            <section className="topic-card" id="scoring">
                <div className="card-eyebrow">Section 11 — Cell 7</div>
                <h2>Combo Scoring: Why 180,000 Rows</h2>
                <div className="code-wrap">
                    <div className="code-label">Python — Cell 7 <span className="code-purpose">Cartesian product → score all combos per customer</span></div>
                    <pre><code className="language-python">{`# Create every (customer × VNR × Reward) combination
combos = pd.DataFrame(
    [(v, r) for v in VNR_OPTIONS for r in REWARD_VALUES],
    columns=['VNR', 'Reward_Value']
)
# 5,000 customers × 4 VNR × 9 Reward = 180,000 rows
scoring_df = all_customers.merge(combos, how='cross')

# Score all 180K rows in one vectorized call
scoring_df['P_Complete'] = model.predict_proba(
    scoring_df[FEATURE_COLS].fillna(0)
)[:, 1]

# Compute value metrics per row
scoring_df['Expected_Cost']    = scoring_df['P_Complete'] * scoring_df['Reward_Value']
scoring_df['Expected_Benefit'] = scoring_df['P_Complete'] * scoring_df['VNR'] * scoring_df['Avg_Order_Val']
scoring_df['Net_Value']        = scoring_df['Expected_Benefit'] - scoring_df['Expected_Cost']`}</code></pre>
                    <div className="code-summary"><strong>Why cross join?</strong> We need to evaluate every customer under every possible offer. The model was trained with VNR and Reward_Value as features, so it can score hypothetical combinations. <strong>Why Net Value and not ROI ratio (Benefit/Cost)?</strong> Ratio would always favor cheap combos — a $1 reward with P=0.01 gets ROI=∞. Net value is the economically correct objective.</div>
                </div>

                <div className="formula-block">
                    {String.raw`$$\text{Net Value} = \underbrace{P_{\text{complete}} \times \text{VNR} \times \text{AOV}}_{\text{Expected Benefit}} - \underbrace{P_{\text{complete}} \times \text{Reward}}_{\text{Expected Cost}}$$`}
                    <p className="formula-label">AOV = Avg_Order_Val. Expected benefit assumes all VNR visits are incremental (acknowledged limitation).</p>
                </div>

                <div className="talking-point">
                    <p>&ldquo;For each of the 5,000 customers, we generate all 36 combos — VNR 3,4,5,6 crossed with all 9 reward values. We feed all 180,000 rows through the trained model to get a completion probability for each. Then we compute Net Value = expected revenue minus expected reward cost, and pick the highest Net Value combo per customer. The key is that VNR and Reward_Value are model inputs, so the same model handles all combos without retraining.&rdquo;</p>
                </div>
            </section>

            {/* ── BUDGET ── */}
            <section className="topic-card" id="budget">
                <div className="card-eyebrow">Section 12 — Cell 8</div>
                <h2>Budget-Constrained Assignment Algorithm</h2>
                <div className="code-wrap">
                    <div className="code-label">Python — Cell 8 <span className="code-purpose">Greedy assignment with budget enforcement</span></div>
                    <pre><code className="language-python">{`# Step 1: Best combo per customer (unconstrained)
best_combos = scoring_df.loc[
    scoring_df.groupby('Customer_ID')['Net_Value'].idxmax()
].copy()

total_committed = best_combos['Reward_Value'].sum()

if total_committed > MONTHLY_BUDGET:
    # OVER BUDGET → downgrade lowest-value customers first
    best_combos = best_combos.sort_values('Net_Value', ascending=True)
    for idx in best_combos.index:
        if excess <= 0: break
        # Find cheapest combo with Net_Value > 0 for this customer
        cheapest = cust_options.sort_values('Reward_Value').iloc[0]
        # Swap to cheapest, reduce excess

elif total_committed < MONTHLY_BUDGET * 0.95:
    # UNDER BUDGET → upgrade highest-value customers
    best_combos = best_combos.sort_values('Net_Value', ascending=False)
    for idx in best_combos.index:
        # Upgrade to next reward tier if budget allows
        ...`}</code></pre>
                    <div className="code-summary"><strong>This is a greedy approximation to the knapsack problem.</strong> The true optimal solution would require integer linear programming. Greedy works by: pick best per customer → if over budget, sacrifice lowest-value customers first → if under budget, reward highest-value customers more. <strong>Why downgrade lowest-value first?</strong> They generate the least expected return per dollar, so reducing their reward has the least impact on total benefit.</div>
                </div>

                <div className="talking-point">
                    <p>&ldquo;The assignment is a two-phase greedy algorithm. Phase one picks the unconstrained best combo per customer — maximize net value individually. Phase two enforces the budget: if we&apos;re over, we downgrade the lowest-value customers to their cheapest viable option. If we&apos;re under, we upgrade the highest-value customers to bigger rewards. It&apos;s a greedy approximation to the knapsack problem. A proper LP would be more optimal but this is fast and interpretable — and the result hit exactly 100% budget utilization.&rdquo;</p>
                </div>

                <div className="gotcha"><strong>Greedy limitation:</strong> This is not globally optimal. Two customers might both want a $120 reward but only one fits in the budget — greedy doesn&apos;t jointly optimize. Integer linear programming (scipy / PuLP) would give the true optimal assignment. For 5,000 customers the LP would solve in seconds.</div>
            </section>

            {/* ── RESULTS ── */}
            <section className="topic-card" id="results">
                <div className="card-eyebrow">Section 13 — Cells 9 + 10</div>
                <h2>Key Results</h2>

                <div className="stat-grid">
                    <div className="stat-card"><span className="stat-val">3.5×</span><span className="stat-label">ML ROI</span></div>
                    <div className="stat-card"><span className="stat-val">2.7×</span><span className="stat-label">Random Pilot ROI</span></div>
                    <div className="stat-card"><span className="stat-val">100%</span><span className="stat-label">Budget Utilization</span></div>
                </div>

                <table className="data-table" style={{ marginTop: '16px' }}>
                    <thead><tr><th>Metric</th><th>Random Pilot</th><th>ML Model</th><th>Delta</th></tr></thead>
                    <tbody>
                        <tr><td>Avg Reward</td><td>$80</td><td>$49</td><td>−39% cheaper</td></tr>
                        <tr><td>Avg VNR</td><td>4.5</td><td>3.2</td><td>Easier challenge</td></tr>
                        <tr><td>Total Cost</td><td>$10,510</td><td>$12,519</td><td>+$2K more spend</td></tr>
                        <tr><td>Total Benefit</td><td>$27,925</td><td>$44,343</td><td>+59% more revenue</td></tr>
                        <tr><td>ROI</td><td>2.7×</td><td>3.5×</td><td>+30% improvement</td></tr>
                    </tbody>
                </table>

                <div className="findings-panel" style={{ marginTop: '16px' }}>
                    <div className="findings-header">Sanity Check — Avg Reward by Segment</div>
                    <ul className="findings-list">
                        <li><strong>Avg Reward decreases from Champions (~$60) → Lost (~$40).</strong> This is the sanity check — the model is spending more on customers who will actually complete challenges. If Lost customers got higher rewards than Champions, the model would be wrong.</li>
                        <li><strong>VNR is nearly uniform at ~3.0–3.3 across all segments.</strong> The model correctly learned that VNR=3 maximizes net value for almost everyone, because the completion rate at VNR=4+ drops so sharply.</li>
                        <li><strong>4,380 out of 5,000 customers received VNR=3.</strong> This is not a failure of personalization — it&apos;s the correct answer given what the pilot data showed about completion rates.</li>
                    </ul>
                </div>

                <div className="talking-point">
                    <p>&ldquo;The sanity check chart shows Champions get the highest rewards and Lost customers the lowest — that&apos;s the expected pattern, which validates the model is working correctly. The ROI comparison shows ML generates $3.50 per dollar spent vs $2.70 for random assignment — a 30% improvement. But I should note this comparison is not perfectly apples-to-apples: the random pilot uses actual realized outcomes, while the ML numbers are expected values from model predictions.&rdquo;</p>
                </div>
            </section>

            {/* ── LIMITATIONS ── */}
            <section className="topic-card" id="limitations">
                <div className="card-eyebrow">Section 14 — Honest Assessment</div>
                <h2>Limitations to Proactively Raise</h2>

                <div className="limit-row">
                    <span className="limit-tag">No uplift model</span>
                    <span className="limit-tag">Small training set</span>
                    <span className="limit-tag">Greedy ≠ optimal</span>
                    <span className="limit-tag">Incremental visits assumed</span>
                    <span className="limit-tag">No control group</span>
                    <span className="limit-tag">Expected ≠ realized ROI</span>
                </div>

                <table className="data-table">
                    <thead><tr><th>Limitation</th><th>Impact</th><th>What You&apos;d Do Differently</th></tr></thead>
                    <tbody>
                        <tr><td>No uplift model</td><td>May reward customers who&apos;d visit anyway</td><td>Train CATE model with control group; use T-learner or causal forest</td></tr>
                        <tr><td>800 training rows</td><td>~22 customers per (VNR, RV) cell; extrapolation uncertain</td><td>Larger stratified pilot with coverage across all 36 cells</td></tr>
                        <tr><td>Greedy assignment</td><td>Not globally budget-optimal</td><td>Integer LP via scipy.optimize or PuLP</td></tr>
                        <tr><td>All visits assumed incremental</td><td>Overstates benefit for frequent visitors</td><td>Add counterfactual: subtract baseline visit rate from VNR</td></tr>
                        <tr><td>ROI comparison not fair</td><td>Pilot = actual, ML = predicted</td><td>Hold out a random 5% for ongoing A/B baseline</td></tr>
                    </tbody>
                </table>

                <div className="talking-point">
                    <p>&ldquo;The biggest limitation is that this is a completion probability model, not an uplift model. We&apos;re predicting whether a customer will complete the challenge — but we&apos;re not measuring how much of that is caused by the offer versus behavior they&apos;d exhibit anyway. A proper uplift model would require a control group in the pilot. Given the pilot structure we had, this was the best available approach, and I&apos;d flag it as the top priority for the next iteration.&rdquo;</p>
                </div>
            </section>

            {/* ── FORMULA SHEET ── */}
            <section className="topic-card" id="formulas">
                <div className="card-eyebrow">Reference</div>
                <h2>Formula Sheet</h2>

                <h3>Expected Cost</h3>
                <div className="formula-block">
                    {String.raw`$$\text{Expected Cost}_i = P_{\text{complete},i} \times \text{Reward}_i$$`}
                    <p className="formula-label">What the business expects to pay out per customer. Probability-weighted reward cost.</p>
                </div>

                <h3>Expected Benefit</h3>
                <div className="formula-block">
                    {String.raw`$$\text{Expected Benefit}_i = P_{\text{complete},i} \times \text{VNR}_i \times \text{AOV}_i$$`}
                    <p className="formula-label">Expected incremental revenue. Assumes all VNR visits are incremental (acknowledged limitation).</p>
                </div>

                <h3>Net Value (Optimization Objective)</h3>
                <div className="formula-block">
                    {String.raw`$$\text{Net Value}_i = P_i \cdot \text{VNR}_i \cdot \text{AOV}_i - P_i \cdot \text{Reward}_i$$`}
                    <p className="formula-label">The quantity maximized per customer. Using subtraction (not ratio) avoids degenerate cheapest-reward strategy.</p>
                </div>

                <h3>Budget Constraint</h3>
                <div className="formula-block">
                    {String.raw`$$\sum_{i=1}^{5000} \text{Reward}_i \leq \$240{,}000$$`}
                    <p className="formula-label">Hard budget constraint enforced by greedy downgrade/upgrade algorithm.</p>
                </div>

                <h3>Log-Loss (Training Objective)</h3>
                <div className="formula-block">
                    {String.raw`$$\mathcal{L} = -\frac{1}{N}\sum_{i=1}^{N}\left[y_i \log \hat{p}_i + (1 - y_i)\log(1-\hat{p}_i)\right]$$`}
                    <p className="formula-label">Binary cross-entropy. y_i ∈ {'{ 0,1 }'} = completion label. p̂_i = model predicted probability.</p>
                </div>

                <h3>GBM Update Rule</h3>
                <div className="formula-block">
                    {String.raw`$$F_m(x) = F_{m-1}(x) + \eta \cdot h_m(x), \quad h_m \text{ fits } r_i = y_i - \hat{p}_i$$`}
                    <p className="formula-label">η = learning_rate (0.05). h_m = new tree fit to pseudo-residuals. F_m = updated ensemble after m trees.</p>
                </div>
            </section>

            {/* ── CONCEPTS ── */}
            <section className="topic-card" id="concepts">
                <div className="card-eyebrow">Reference</div>
                <h2>All Concepts at a Glance</h2>
                <table className="data-table">
                    <thead><tr><th>Concept</th><th>Used Where</th><th>Why Used</th></tr></thead>
                    <tbody>
                        <tr><td>KBinsDiscretizer (K-Means)</td><td>Cell 3 — Visit Tiers</td><td>Data-driven tier boundaries, adapts to actual distribution</td></tr>
                        <tr><td>RFM Scoring</td><td>Cell 4</td><td>Interpretable segments + numeric features for model in one step</td></tr>
                        <tr><td>Discount_Amount signal</td><td>Cell 5 — Target label</td><td>Unambiguous completion signal: discount only fires when VNR hit</td></tr>
                        <tr><td>VNR + Reward as features</td><td>Cell 6 — Model design</td><td>Enables scoring all 36 combos with one model</td></tr>
                        <tr><td>GradientBoostingClassifier</td><td>Cell 6 — ML model</td><td>Handles non-linear feature interactions; calibrated probabilities</td></tr>
                        <tr><td>Binary cross-entropy loss</td><td>Cell 6 — Training</td><td>Optimizes probability calibration needed for budget math</td></tr>
                        <tr><td>5-fold Stratified CV</td><td>Cell 6 — Evaluation</td><td>Robust eval on small dataset; preserves class balance in folds</td></tr>
                        <tr><td>AUC / Log-Loss / Brier</td><td>Cell 6 — Metrics</td><td>Ranking quality + calibration + combined — each tests different things</td></tr>
                        <tr><td>Cartesian product scoring</td><td>Cell 7 — 180K rows</td><td>Score every customer under every possible combo in one pass</td></tr>
                        <tr><td>Net Value objective</td><td>Cell 7–8</td><td>Avoids degenerate ratio-based cheapest-reward strategies</td></tr>
                        <tr><td>Greedy knapsack</td><td>Cell 8 — Assignment</td><td>Fast, interpretable budget enforcement; approximates optimal LP</td></tr>
                        <tr><td>Uplift model (missing)</td><td>Limitation</td><td>Would measure causal effect of offer vs baseline behavior</td></tr>
                    </tbody>
                </table>
            </section>

            <style jsx>{`
        .zs-container {
          max-width: 860px;
          padding: 2rem 2.5rem 6rem;
          margin: 0 auto;
        }

        .hero {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--color-border);
        }

        .hero-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }

        .hero h1 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--color-text-main);
          margin-bottom: 0.75rem;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          max-width: 520px;
          margin-bottom: 1.2rem;
          line-height: 1.7;
        }

        .badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .badge {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.2rem 0.7rem;
          border-radius: 100px;
          background: rgba(108, 140, 255, 0.12);
          color: var(--color-primary);
          border: 1px solid rgba(108, 140, 255, 0.25);
        }

        .topic-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 1.6rem 2rem;
          margin-bottom: 1.5rem;
          scroll-margin-top: 2rem;
        }

        .topic-card:hover {
          border-color: var(--color-border-hover, #3d444d);
        }

        .card-eyebrow {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 0.6rem;
        }

        .topic-card h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 0.85rem;
          letter-spacing: -0.3px;
        }

        .topic-card h3 {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin: 1.3rem 0 0.6rem;
        }

        .topic-card p {
          color: var(--color-text-subtle);
          font-size: 0.88rem;
          line-height: 1.75;
          margin-bottom: 0.75rem;
        }

        .topic-card p:last-child { margin-bottom: 0; }
        .topic-card strong { color: var(--color-text-main); font-weight: 600; }

        .talking-point {
          background: rgba(108, 140, 255, 0.06);
          border: 1px solid rgba(108, 140, 255, 0.2);
          border-radius: 8px;
          padding: 1rem 1.2rem;
          margin: 1rem 0;
          position: relative;
        }

        .talking-point::before {
          content: 'TALKING POINT';
          position: absolute;
          top: -1px;
          left: 1rem;
          transform: translateY(-50%);
          background: var(--color-surface);
          padding: 0 0.5rem;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--color-primary);
        }

        .talking-point p {
          color: var(--color-text-subtle) !important;
          font-size: 0.85rem !important;
          font-style: italic;
          margin: 0 !important;
          line-height: 1.7;
        }

        .gotcha {
          background: rgba(210, 153, 34, 0.07);
          border-left: 3px solid #d29922;
          border-radius: 0 6px 6px 0;
          padding: 0.85rem 1rem;
          margin: 1rem 0;
          font-size: 0.83rem;
          color: #c9aa71;
          line-height: 1.65;
        }

        .gotcha strong { color: #d29922; }

        .success-note {
          background: rgba(63, 185, 80, 0.07);
          border-left: 3px solid #3fb950;
          border-radius: 0 6px 6px 0;
          padding: 0.85rem 1rem;
          margin: 1rem 0;
          font-size: 0.83rem;
          color: #8ddb8c;
          line-height: 1.65;
        }

        .formula-block {
          background: var(--color-surface-2, #1c2333);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1.2rem 1.5rem;
          margin: 1rem 0;
          overflow-x: auto;
          text-align: center;
        }

        .formula-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.6rem;
          text-align: left;
          font-style: italic;
        }

        .code-wrap {
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--color-border);
        }

        .code-label {
          background: var(--color-surface-2, #1c2333);
          padding: 0.5rem 1rem;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--color-text-muted);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .code-purpose {
          color: #3fb950;
          font-size: 0.68rem;
          letter-spacing: 0;
          text-transform: none;
          font-weight: 400;
          font-style: italic;
        }

        .code-wrap pre { margin: 0; border-radius: 0; border: none; }
        .code-wrap pre code { font-size: 0.78rem !important; padding: 1rem 1.2rem !important; line-height: 1.65 !important; }

        .code-summary {
          background: var(--color-surface-2, #1c2333);
          border-top: 1px solid var(--color-border);
          padding: 0.85rem 1rem;
          font-size: 0.8rem;
          color: var(--color-text-subtle);
          line-height: 1.65;
        }

        .code-summary strong { color: var(--color-text-main); }

        .findings-panel {
          background: var(--color-surface-2, #1c2333);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          margin: 1.2rem 0;
        }

        .findings-header {
          padding: 0.7rem 1rem;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-muted);
          letter-spacing: 0.5px;
        }

        .findings-list {
          list-style: none;
          padding: 0.75rem 1rem;
          margin: 0;
          font-size: 0.82rem;
        }

        .findings-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(48, 54, 61, 0.5);
          color: var(--color-text-subtle);
          display: flex;
          gap: 0.6rem;
          line-height: 1.55;
        }

        .findings-list li:last-child { border-bottom: none; }
        .findings-list li::before { content: '→'; color: var(--color-primary); flex-shrink: 0; }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin: 1rem 0;
        }

        .stat-card {
          background: var(--color-surface-2, #1c2333);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .stat-val {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-primary);
          display: block;
          line-height: 1.1;
        }

        .stat-label {
          font-size: 0.68rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
          display: block;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          margin: 0.85rem 0;
        }

        .data-table th {
          background: var(--color-surface-2, #1c2333);
          padding: 0.6rem 0.85rem;
          text-align: left;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--color-text-muted);
          border-bottom: 1px solid var(--color-border);
        }

        .data-table td {
          padding: 0.6rem 0.85rem;
          border-bottom: 1px solid rgba(48, 54, 61, 0.5);
          color: var(--color-text-subtle);
          vertical-align: top;
          line-height: 1.55;
        }

        .data-table tr:last-child td { border-bottom: none; }
        .data-table td:first-child { color: var(--color-primary); font-weight: 500; white-space: nowrap; }
        .data-table tr:hover td { background: rgba(255,255,255,0.02); }

        .limit-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0.85rem 0;
        }

        .limit-tag {
          background: rgba(248, 81, 73, 0.1);
          border: 1px solid rgba(248, 81, 73, 0.2);
          color: #ff7b72;
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
        }
      `}</style>
        </div>
    );
}
