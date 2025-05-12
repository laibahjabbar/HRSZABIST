const express=require('express');
const cors=require('cors');
const pool=require('./db');
const e = require('express');
require('dotenv').config();

console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded successfully' : 'NOT loaded');

const app=express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    try{
        res.json('welcome ');
    }
    catch(err){
        res.status(500).json({Error:err.messgage})
    }
});


app.get('/emp',async(req,res)=>{
    try{
        const result =await pool.query('select * from employees ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/empcount',async(req,res)=>{
    try{
        const result =await pool.query('select count(*) from employees ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/countriescount',async(req,res)=>{
    try{
        const result =await pool.query('select count(*) from countries ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/regionscount',async(req,res)=>{
    try{
        const result =await pool.query('select count(*) from regions ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/depsscount',async(req,res)=>{
    try{
        const result =await pool.query('select count(*) from departments ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})
app.get('/employeewithlocation', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.employee_id,
                e.first_name,
                d.department_name,
                l.city,
                c.country_name
            FROM 
                employees e
                JOIN departments d ON e.department_id = d.department_id
                JOIN locations l ON d.location_id = l.location_id
                JOIN countries c ON l.country_id = c.country_id
                limit 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message }); // یہا
    }
});
app.get('/empalongwithjobhistoryrecord', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.first_name,
                e.last_name,
                jh.*
            FROM 
                employees e
                JOIN job_history jh ON e.job_id = jh.job_id
                limit 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message }); // یہا
    }
});
app.get('/empalongwithjobhistoryrecorddeplocation', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.first_name,
                e.last_name,
                e.employee_id,
                l.*,
                d.department_name,
                jh.start_date,
                jh.end_date
            FROM 
                employees e
                JOIN job_history jh ON e.job_id = jh.job_id
                JOIN departments d  on jh.department_id = d.department_id
                JOIN locations as l on d.location_id = l.location_id
                limit 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message }); // یہ
    }
});
app.get('/empalongwithjobandcountry', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.first_name,
                e.employee_id,
                jh.*,
                c.country_name
            FROM 
                employees e
                JOIN job_history jh ON e.employee_id = jh.employee_id
                JOIN departments d ON e.department_id = d.department_id
                JOIN locations l ON d.location_id = l.location_id
                JOIN countries c ON l.country_id = c.country_id
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/Morejobs', async (req, res) => {
    try {
        const result = await pool.query(`
          SELECT 
           e.first_name,
           e.last_name
FROM 
    employees e
    JOIN job_history jh ON e.employee_id = jh.employee_id
GROUP BY 
    e.employee_id, e.first_name, e.last_name
HAVING 
    COUNT(jh.job_id) > 1

        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/empcountperdept', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                d.department_name,
                COUNT(e.employee_id) AS employee_count
            FROM 
                departments d
                LEFT JOIN employees e ON e.department_id = d.department_id
            GROUP BY 
                d.department_id, d.department_name
            ORDER BY 
                employee_count DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/totalsalaryperjob', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                j.job_title,
                SUM(e.salary) AS total_salary
            FROM 
                employees e
                JOIN jobs j ON e.job_id = j.job_id
            GROUP BY 
                j.job_title
            ORDER BY 
                total_salary DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/avgcommissionperdept', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                d.department_name,
                AVG(e.commission_pct) AS avg_commission_pct
            FROM 
                employees e
                JOIN departments d ON e.department_id = d.department_id
            GROUP BY 
                d.department_id, d.department_name
            ORDER BY 
                avg_commission_pct DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/employeeswithz', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.first_name,
                e.last_name,
                d.department_name,
                l.city,
                l.state_province
            FROM 
                employees e
                JOIN departments d ON e.department_id = d.department_id
                JOIN locations l ON d.location_id = l.location_id
            WHERE 
                e.first_name ILIKE '%z%'
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/jobhistorydates', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                j.job_title,
                d.department_name,
                e.first_name || ' ' || e.last_name AS full_name,
                jh.start_date
            FROM 
                job_history jh
                JOIN jobs j ON jh.job_id = j.job_id
                JOIN employees e ON jh.employee_id = e.employee_id
                JOIN departments d ON e.department_id = d.department_id
            WHERE 
                jh.start_date >= '1993-01-01'
                AND jh.end_date <= '1997-08-31'
            ORDER BY 
                jh.start_date
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/departmentswith2employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.country_name,
                l.city,
                d.department_name,
                COUNT(e.employee_id) AS num_employees
            FROM 
                departments d
                JOIN employees e ON e.department_id = d.department_id
                JOIN locations l ON d.location_id = l.location_id
                JOIN countries c ON l.country_id = c.country_id
            GROUP BY 
                c.country_name, l.city, d.department_name
            HAVING 
                COUNT(e.employee_id) >= 2
            ORDER BY 
                num_employees DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
    app.get('/jobwithoutcommission', async (req, res) => {
        try {
            const result = await pool.query(`
               SELECT 
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS full_name,
    c.country_id,
    c.country_name
FROM 
    employees e
JOIN 
    departments d ON e.department_id = d.department_id
JOIN 
    locations l ON d.location_id = l.location_id
JOIN 
    countries c ON l.country_id = c.country_id;

            `);
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ Error: err.message });
        }
    });
    
});
app.get('/lastjobwithoutcommission', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.employee_id,
                CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                j.job_title,
                h.start_date,
                h.end_date
            FROM 
                employees e
            JOIN 
                job_history h ON e.employee_id = h.employee_id
            JOIN 
                jobs j ON h.job_id = j.job_id
            WHERE 
                e.commission_pct IS NULL
                AND (h.start_date, h.end_date) = (
                    SELECT 
                        MAX(h2.start_date), MAX(h2.end_date)
                    FROM 
                        job_history h2
                    WHERE 
                        h2.employee_id = h.employee_id
                );
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/employeecountry', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.employee_id,
                CONCAT(e.first_name, ' ', e.last_name) AS full_name,
                c.country_id,
                c.country_name
            FROM 
                employees e
            JOIN 
                departments d ON e.department_id = d.department_id
            JOIN 
                locations l ON d.location_id = l.location_id
            JOIN 
                countries c ON l.country_id = c.country_id;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/lowest-salary-employees', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.first_name,
                e.last_name,
                e.salary,
                e.department_id
            FROM 
                employees e
            WHERE 
                e.salary = (
                    SELECT MIN(e2.salary)
                    FROM employees e2
                    WHERE e2.department_id = e.department_id
                );
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});app.get('/third-highest-salary', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM employees
            WHERE salary = (
                SELECT DISTINCT salary
                FROM employees
                ORDER BY salary DESC
                OFFSET 2 LIMIT 1
            );
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/above-average-salary-j-dept', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.employee_id,
                e.first_name,
                e.last_name,
                e.salary
            FROM 
                employees e
            WHERE 
                e.salary > (
                    SELECT AVG(salary) FROM employees
                )
                AND e.department_id IN (
                    SELECT DISTINCT department_id
                    FROM employees
                    WHERE first_name ILIKE '%j%' OR last_name ILIKE '%j%'
                );
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/employees-in-toronto', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.employee_id,
                e.first_name,
                e.last_name,
                j.job_title
            FROM 
                employees e
            JOIN 
                jobs j ON e.job_id = j.job_id
            JOIN 
                departments d ON e.department_id = d.department_id
            JOIN 
                locations l ON d.location_id = l.location_id
            WHERE 
                l.city = 'Toronto';
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
app.get('/country',async(req,res)=>{
    try{
        const result =await pool.query('select * from countries ');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.messgage})
    }
})



const PORT=process.env.PORT;
app.listen(PORT,()=>{
   console.log(`connect successfully..on PORT ${PORT}`);
});