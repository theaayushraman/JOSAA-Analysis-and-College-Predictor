document.addEventListener('DOMContentLoaded', function() {
    const csvUrl = 'https://raw.githubusercontent.com/theaayushraman/JOSAA-Analysis/main/new_df.csv';
    const form = document.getElementById('filterForm');

   
    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;
            populateDropdowns(data);
            form.addEventListener('submit', function(event) {
                event.preventDefault();

                const rank = document.getElementById('rank').value;
                const quota = document.getElementById('quota').value;
                const seatType = document.getElementById('seatType').value;
                const gender = document.getElementById('gender').value;
                const roundNo = document.getElementById('roundNo').value;
                const instituteType = document.getElementById('instituteType').value;

                const filteredResults = filterData(data, rank, quota, seatType, gender, roundNo, instituteType);
                displayResults(filteredResults);
            });
        },
        error: function(error) {
            console.error('Error parsing CSV:', error);
        }
    });
});

function populateDropdowns(data) {
    const quotas = new Set();
    const seatTypes = new Set();
    const genders = new Set();

    data.forEach(row => {
        if (row.Quota) quotas.add(row.Quota);
        if (row['Seat Type']) seatTypes.add(row['Seat Type']);
        if (row.Gender) genders.add(row.Gender);
    });

    document.getElementById('quota').innerHTML = Array.from(quotas).map(quota => `<option value="${quota}">${quota}</option>`).join('');
    document.getElementById('seatType').innerHTML = Array.from(seatTypes).map(seatType => `<option value="${seatType}">${seatType}</option>`).join('');
    document.getElementById('gender').innerHTML = Array.from(genders).map(gender => `<option value="${gender}">${gender}</option>`).join('');
}

function filterData(data, rank, quota, seatType, gender, roundNo, instituteType) {
    const results = [];
    const roundIndex = `Closing Rank Round ${roundNo}`;

    data.forEach(row => {
        const closingRank = row[roundIndex];
        const institute = row.Institute;
        let instituteCategory = 'GFTI'; 

        if (institute.startsWith('Indian Institute of Technology')) {
            instituteCategory = 'IIT';
        } else if (institute.startsWith('Indian Institute of Information Technology')) {
            instituteCategory = 'IIIT';
        } else if (institute.startsWith('National Institute of Technology')) {
            instituteCategory = 'NIT';
        }

        if ((instituteType === 'All' || instituteCategory === instituteType) &&
            row.Quota === quota &&
            row['Seat Type'] === seatType &&
            row.Gender === gender &&
            parseInt(closingRank) >= parseInt(rank)) {
            results.push({
                institute: row.Institute,
                academicProgram: row['Academic Program Name'],
                closingRank: parseInt(closingRank)
            });
        }
    });

    // Sort results by closing rank in ascending order
    results.sort((a, b) => a.closingRank - b.closingRank);

    return results;
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No programs available for the given criteria.</p>';
        return;
    }

    // Create and append the heading for the results grid
    const heading = document.createElement('div');
    heading.classList.add('results-heading');
    heading.innerHTML = `
        <div>College</div>
        <div>Branch</div>
        <div>Closing Rank</div>
    `;
    resultsContainer.appendChild(heading);

    // Create and append the results grid
    const grid = document.createElement('div');
    grid.classList.add('results-grid');

    results.forEach((result, index) => {
        const instituteDiv = document.createElement('div');
        const programDiv = document.createElement('div');
        const rankDiv = document.createElement('div');

        instituteDiv.textContent = result.institute;
        programDiv.textContent = result.academicProgram;
        rankDiv.textContent = result.closingRank;

        instituteDiv.classList.add('result-item', 'animate-slide-in');
        programDiv.classList.add('result-item', 'animate-slide-in');
        rankDiv.classList.add('result-item', 'animate-slide-in');

        instituteDiv.style.animationDelay = `${index * 0.1}s`;
        programDiv.style.animationDelay = `${index * 0.1}s`;
        rankDiv.style.animationDelay = `${index * 0.1}s`;

        grid.appendChild(instituteDiv);
        grid.appendChild(programDiv);
        grid.appendChild(rankDiv);
    });

    resultsContainer.appendChild(grid);

    const container = document.querySelector('.container');
    container.classList.add('results-expanded');

    resultsContainer.scrollIntoView({ behavior: 'smooth' });

    const credits = document.getElementById('credits');
    credits.style.display = 'block';
}
