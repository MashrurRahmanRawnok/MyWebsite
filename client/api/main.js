import fs from 'fs';
import express from 'express';

const app = express();
const colorFilePath = './api/currentColor.txt'; // File to store the current color
const adminPassword = 'your_admin_password'; // Change this to your desired admin password

// Color map to convert color names to hex values
const colorMap = {
    "red": '#ff0000',
    "blue": '#0000ff',
    "green": '#00ff00',
    // Add more color mappings as needed
};

// Route to change theme color
app.post('/change-color', (req, res) => {
    const newColor = req.query.ThemeColor;
    const adminPass = req.query.adminPass;
    
    if (!newColor || adminPass !== adminPassword) {
        return res.status(401).send('Unauthorized or ThemeColor parameter missing');
    }

    // Check if the new color is a valid hexadecimal color code
    const isValidHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor);
    
    // If it's a valid hex color code, use it directly
    // Otherwise, check if it's a color name and get its corresponding hex value from the color map
    const colorToUse = isValidHexColor ? newColor : (colorMap[newColor.toLowerCase()] || newColor);

    // Replace color in HTML file
    readCurrentColorFromFile((oldColor) => {
        replaceColorInHTML('../client/src/Components/sample.html', oldColor, colorToUse);
        res.send('Color changed successfully');
    });
});

// Function to read HTML file and replace color
function replaceColorInHTML(filePath, oldColor, newColor) {
    // Read HTML file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            return;
        }

        // Replace color in HTML content
        const updatedHTML = data.replace(new RegExp(oldColor, 'g'), newColor);

        // Write updated HTML content back to file
        fs.writeFile(filePath, updatedHTML, 'utf8', (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
                return;
            }
            console.log('Color replaced successfully!');
            
            // Write new color to file
            fs.writeFile(colorFilePath, newColor, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing current color file:', err);
                    return;
                }
                console.log('Current color saved to file:', newColor);
            });
        });
    });
}

// Function to read current color from file
function readCurrentColorFromFile(callback) {
    fs.readFile(colorFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading current color file:', err);
            return;
        }
        callback(data.trim());
    });
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
