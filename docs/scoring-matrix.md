## Scoring Matrix

**Flow Name:** Lead Scoring and Priority Level Assignment  


---

### Business Type (Business_Type__c)

- Premium Wine Distributor (5)  
- High-End Wine Store (4)  
- Upscale Restaurant (3)  
- Specialty Gourmet Grocer (2)  
- Catering & Event Company (1)  
- Personal/Individual (Non-Business) → **Gatekeeper**  

**Gatekeeper Rule:**  
Personal/Individual (Non-Business) → ❌ Not Qualified (Excluded from scoring)  


---

### Role (Role__c)

- Owner (5)  
- Purchasing Manager (4)  
- General Manager (3)  
- Sales Manager (2)  
- Event Coordinator (1)  


---

### Purchasing Timeline (Purchasing_Timeline__c)

- Immediate Need (Contracting) (5)  
- Short-Term (Within 30 Days) (4)  
- Evaluating Vendors (Next 90 Days) (3)  
- Budget Planning (Future Quarter) (2)  
- Information Gathering (1)  


---

### Scoring Variable

**varTotalScore**  

A cumulative integer initialized at 0.  
Incremented via Assignment elements across:

- Business Type  
- Role  
- Purchasing Timeline  

Used exclusively for **Priority_Level__c determination**.  
No impact on qualification logic.  


---

### Priority Thresholds (Priority_Level__c)

- **High:** ≥ 12  
- **Medium:** ≥ 8 and < 12  
- **Low:** ≤ 7  


---

### Constraints

- **Minimum Score:** 3  
- **Maximum Score:** 15  


---

### Architectural Notes

- Qualification is **binary and upstream** (Gatekeeper-controlled via Business_Type__c)  
- Scoring is **deterministic and downstream** (no conditional branching beyond assignment)  
- Guarantees:
  - No partial scoring (all qualified Leads receive full 3-factor evaluation)  
  - No overlap between qualification and prioritization layers  