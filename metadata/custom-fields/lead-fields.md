# Lead Custom Fields — Metadata Reference

**Salesforce Case Study: Lead — Priority Level Automation**
Céleste Vineyards

---

## 1. Document Purpose

This document provides the raw metadata reference for all nine custom fields on the Salesforce Lead Object used in the Céleste Vineyards Lead Priority Level Automation system. Content is derived directly from `.field-meta.xml` files retrieved from the live Salesforce Developer Edition org via SFDX CLI.

This document serves as the metadata source of record for this project. It is intended for technical reviewers who require direct traceability between the live org configuration and the documentation set.

---

## 2. Retrieval Details

| Attribute | Value |
|---|---|
| Retrieval Command | `sf project retrieve start --metadata "CustomField:Lead.[API Name]"` |
| Org | `celeste-vineyards-dev-ed.develop.my.salesforce.com` |
| API Version | v66.0 |
| Retrieval Status | Succeeded |
| Retrieval Path | `force-app/main/default/objects/Lead/fields/` |
| Files Retrieved | 9 |
| Retrieval Date | 2026-03-26 |

---

## 3. Business_Type__c

**File:** `Business_Type__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Business_Type__c</fullName>
    <description>Primary B2B gatekeeper and scoring input. Originates from LeadSource
    Céleste Vineyards - Business Inquiry Form. 'Personal/Individual' selections trigger
    frontend disqualification. Valid business types contribute point values to varTotalScore
    for Priority_Level__c calculation.</description>
    <inlineHelpText>Identifies organizational category. Originates from LeadSource Céleste
    Vineyards - Business Inquiry Form. 'Personal/Individual' selections are disqualified per
    B2B model requirements. Valid entries contribute to automated Priority_Level__c.</inlineHelpText>
    <label>Business Type</label>
    <required>true</required>
    <trackFeedHistory>false</trackFeedHistory>
    <type>Picklist</type>
    <valueSet>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value>
                <fullName>Specialty Gourmet Grocer</fullName>
                <default>false</default>
                <label>Specialty Gourmet Grocer</label>
            </value>
            <value>
                <fullName>Upscale Restaurant</fullName>
                <default>false</default>
                <label>Upscale Restaurant</label>
            </value>
            <value>
                <fullName>High-End Wine Store</fullName>
                <default>false</default>
                <label>High-End Wine Store</label>
            </value>
            <value>
                <fullName>Catering &amp; Event Company</fullName>
                <default>false</default>
                <label>Catering &amp; Event Company</label>
            </value>
            <value>
                <fullName>Premium Wine Distributor</fullName>
                <default>false</default>
                <label>Premium Wine Distributor</label>
            </value>
            <value>
                <fullName>Personal/Individual (Non-Business)</fullName>
                <default>false</default>
                <label>Personal/Individual (Non-Business)</label>
            </value>
        </valueSetDefinition>
    </valueSet>
</CustomField>
```

---

## 4. Role__c

**File:** `Role__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Role__c</fullName>
    <description>Captures purchasing authority and organizational position. Originates from
    LeadSource Céleste Vineyards - Business Inquiry Form. Primary input for Priority_Level__c
    calculation logic and Lead scoring.</description>
    <inlineHelpText>Indicate Lead's purchasing authority or position. Originates from LeadSource
    Céleste Vineyards - Business Inquiry Form. This value determines the automated
    Priority_Level__c calculation.</inlineHelpText>
    <label>Role</label>
    <required>true</required>
    <trackFeedHistory>false</trackFeedHistory>
    <type>Picklist</type>
    <valueSet>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value>
                <fullName>Owner</fullName>
                <default>false</default>
                <label>Owner</label>
            </value>
            <value>
                <fullName>Purchasing_Manager</fullName>
                <default>false</default>
                <label>Purchasing Manager</label>
            </value>
            <value>
                <fullName>General_Manager</fullName>
                <default>false</default>
                <label>General Manager</label>
            </value>
            <value>
                <fullName>Sales_Manager</fullName>
                <default>false</default>
                <label>Sales Manager</label>
            </value>
            <value>
                <fullName>Event_Coordinator</fullName>
                <default>false</default>
                <label>Event Coordinator</label>
            </value>
        </valueSetDefinition>
    </valueSet>
</CustomField>
```

---

## 5. Purchasing_Timeline__c

**File:** `Purchasing_Timeline__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Purchasing_Timeline__c</fullName>
    <description>Captures the Lead's expected procurement window. Originates from LeadSource
    Céleste Vineyards - Business Inquiry Form. Primary input for Priority_Level__c calculation
    logic and Lead scoring.</description>
    <inlineHelpText>Indicate Lead's expected procurement window. Originates from LeadSource
    Céleste Vineyards - Business Inquiry Form. This value determines the automated
    Priority_Level__c calculation and Lead scoring.</inlineHelpText>
    <label>Purchasing Timeline</label>
    <required>false</required>
    <trackFeedHistory>false</trackFeedHistory>
    <type>Picklist</type>
    <valueSet>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value>
                <fullName>Immediate Need (Contracting)</fullName>
                <default>false</default>
                <label>Immediate Need (Contracting)</label>
            </value>
            <value>
                <fullName>Short-Term (Within 30 Days)</fullName>
                <default>false</default>
                <label>Short-Term (Within 30 Days)</label>
            </value>
            <value>
                <fullName>Evaluating Vendors (Next 90 Days)</fullName>
                <default>false</default>
                <label>Evaluating Vendors (Next 90 Days)</label>
            </value>
            <value>
                <fullName>Budget Planning (Future Quarter)</fullName>
                <default>false</default>
                <label>Budget Planning (Future Quarter)</label>
            </value>
            <value>
                <fullName>Information Gathering</fullName>
                <default>false</default>
                <label>Information Gathering</label>
            </value>
            <value>
                <fullName>Not Applicable</fullName>
                <default>false</default>
                <label>Not Applicable</label>
            </value>
        </valueSetDefinition>
    </valueSet>
</CustomField>
```

---

## 6. Priority_Level__c

**File:** `Priority_Level__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Priority_Level__c</fullName>
    <description>Reflects the point sum (varTotalScore) from LeadSource Céleste Vineyards -
    Business Inquiry Form. Lead Scoring and Priority Automation flow assigns Levels
    (High ≥ 12, Medium ≥ 8, Low &lt; 8). High Priority escalated to National Sales
    Director.</description>
    <inlineHelpText>Calculated via varTotalScore from the Céleste Vineyards - Business Inquiry
    Form. Defines Priority Level: High (≥ 12), Medium (≥ 8), or Low (&lt; 8). High Priority
    triggers escalation to the National Sales Director.</inlineHelpText>
    <label>Priority Level</label>
    <required>false</required>
    <trackFeedHistory>false</trackFeedHistory>
    <type>Picklist</type>
    <valueSet>
        <restricted>true</restricted>
        <valueSetDefinition>
            <sorted>false</sorted>
            <value>
                <fullName>Low</fullName>
                <default>false</default>
                <label>Low</label>
            </value>
            <value>
                <fullName>Medium</fullName>
                <default>false</default>
                <label>Medium</label>
            </value>
            <value>
                <fullName>High</fullName>
                <default>false</default>
                <label>High</label>
            </value>
            <value>
                <fullName>Disqualified</fullName>
                <default>false</default>
                <label>Disqualified</label>
            </value>
            <value>
                <fullName>Not Applicable</fullName>
                <default>false</default>
                <label>Not Applicable</label>
            </value>
        </valueSetDefinition>
    </valueSet>
</CustomField>
```

---

## 7. Qualified__c

**File:** `Qualified__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Qualified__c</fullName>
    <defaultValue>true</defaultValue>
    <description>Authoritative qualification flag used by automation to indicate whether the
    lead meets baseline B2B eligibility criteria for sales engagement.</description>
    <inlineHelpText>Checked = Lead qualifies as a valid business prospect. Unchecked = Lead
    is disqualified from sales qualification logic.</inlineHelpText>
    <label>Qualified</label>
    <trackFeedHistory>false</trackFeedHistory>
    <type>Checkbox</type>
</CustomField>
```

---

## 8. Qualification_Status__c

**File:** `Qualification_Status__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Qualification_Status__c</fullName>
    <description>Visual formula field derived from Qualified__c. Displays a qualification
    indicator for sales users based on the lead's current qualification state.</description>
    <externalId>false</externalId>
    <formula>IF(
    Qualified__c,
    "✅ Qualified",
    "❌ Not Qualified"
)</formula>
    <formulaTreatBlanksAs>BlankAsZero</formulaTreatBlanksAs>
    <inlineHelpText>Visual qualification indicator. ✅ = Qualified for sales engagement.
    ❌ = Disqualified based on lead intake criteria.</inlineHelpText>
    <label>Qualification Status</label>
    <required>false</required>
    <type>Text</type>
    <unique>false</unique>
</CustomField>
```

---

## 9. Customer_Note__c

**File:** `Customer_Note__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Customer_Note__c</fullName>
    <description>Long text field capturing Lead-specific questions and unique inquiries.
    Originates at the base of LeadSource Céleste Vineyards - Business Inquiry Form. Provides
    unstructured context to supplement automated Priority_Level__c scoring.</description>
    <inlineHelpText>Long text field for unique Lead questions and specific case inquiries.
    Originates from the Céleste Vineyards - Business Inquiry Form.</inlineHelpText>
    <label>Customer Note</label>
    <required>false</required>
    <trackFeedHistory>false</trackFeedHistory>
    <type>TextArea</type>
</CustomField>
```

---

## 10. Region__c

**File:** `Region__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Region__c</fullName>
    <description>Identifies Lead geographic assignment (West Coast, East Coast, Central) based
    on State. Primary driver for Lead Assignment Rules Céleste - Regional Sales Representatives
    and Queue distribution for Céleste Vineyards Pipeline.</description>
    <externalId>false</externalId>
    <formula>CASE(State,
"Alabama", "East Coast",
"Connecticut", "East Coast",
"Delaware", "East Coast",
"District of Columbia", "East Coast",
"Florida", "East Coast",
"Georgia", "East Coast",
"Maine", "East Coast",
"Maryland", "East Coast",
"Massachusetts", "East Coast",
"New Hampshire", "East Coast",
"New Jersey", "East Coast",
"New York", "East Coast",
"North Carolina", "East Coast",
"Pennsylvania", "East Coast",
"Rhode Island", "East Coast",
"South Carolina", "East Coast",
"Tennessee", "East Coast",
"Vermont", "East Coast",
"Virginia", "East Coast",
"West Virginia", "East Coast",
"Arkansas", "Central",
"Illinois", "Central",
"Indiana", "Central",
"Iowa", "Central",
"Kansas", "Central",
"Kentucky", "Central",
"Louisiana", "Central",
"Michigan", "Central",
"Minnesota", "Central",
"Mississippi", "Central",
"Missouri", "Central",
"Nebraska", "Central",
"North Dakota", "Central",
"Ohio", "Central",
"Oklahoma", "Central",
"South Dakota", "Central",
"Texas", "Central",
"Wisconsin", "Central",
"Alaska", "West Coast",
"Arizona", "West Coast",
"California", "West Coast",
"Colorado", "West Coast",
"Hawaii", "West Coast",
"Idaho", "West Coast",
"Montana", "West Coast",
"Nevada", "West Coast",
"New Mexico", "West Coast",
"Oregon", "West Coast",
"Utah", "West Coast",
"Washington", "West Coast",
"Wyoming", "West Coast",
"International")</formula>
    <formulaTreatBlanksAs>BlankAsZero</formulaTreatBlanksAs>
    <inlineHelpText>Identifies Lead geographic assignment (West Coast, East Coast, Central)
    based on State. Primary driver for Lead Assignment Rules and Queue distribution for
    Céleste Vineyards Pipeline.</inlineHelpText>
    <label>Region</label>
    <required>false</required>
    <type>Text</type>
    <unique>false</unique>
</CustomField>
```

---

## 11. Lead_Created__c

**File:** `Lead_Created__c.field-meta.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>Lead_Created__c</fullName>
    <description>Date-only formula field derived from the standard Lead CreatedDate field.
    Used to display and report on record creation as a date without time.</description>
    <formula>DATEVALUE(CreatedDate)</formula>
    <formulaTreatBlanksAs>BlankAsZero</formulaTreatBlanksAs>
    <inlineHelpText>Displays the date this lead was created. This is a formula field based
    on the standard CreatedDate field and does not include time.</inlineHelpText>
    <label>Lead Created</label>
    <required>false</required>
    <type>Date</type>
</CustomField>
```

---

## 12. Document Status

| Attribute | Value |
|---|---|
| Status | Final |
| File Path | `metadata/custom-fields/lead-fields.md` |
| Date Produced | 2026-03-26 |
| Next Document | `metadata/formulas/priority-formulas.md` |

---

*Salesforce Case Study — Céleste Vineyards | Built by Nathaniel Muncie*
