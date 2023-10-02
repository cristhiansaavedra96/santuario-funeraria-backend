const { Router } = require('express');
const multer = require('multer');
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    },
})

const router = Router();
const { getLogo, genericGet, genericDelete, genericUpdate, createProfile, getCompanyData, updateCompanyData, createCompanyData, uploadLogo, deleteContract, getProfiles, updatePermissions, getUserPermissions, getPermissionsByProfile, deleteRequest, login, register, getRequests, insertRequest } = require('../controllers');
const { getClients, getClient, updateClient, createClient, deleteClient, getClientByNameAndBirthDate } = require('../controllers/clients');
const { getEmployees, getEmployee, updateEmployee, createEmployee, deleteEmployee, updateEmployeesWay } = require('../controllers/employees');
const { getUsers, getUser, updateUser, createUser, deleteUser } = require('../controllers/users');
const { getPacks, getPack, updatePack, createPack, deletePack } = require('../controllers/packs');
const { updateContractNumber,
    getBeneficiary,
    createBeneficiary,
    updateBeneficiary,
    getFinancing,
    createFinancing,
    updateFinancing,
    getContract,
    getContracts,
    createContract,
    updateContract,
    getSale,
    createSale,
    updateSale,
    getPayment,
    createMassivePayment,
    getRequest,
    createRequest,
    updateRequest,
    getCeremony,
    createCeremony,
    updateCeremony,
    getDeceased,
    createDeceased,
    updateDeceased,
    getService,
    createService,
    updateService,
    getSales,
    getPayments,
    getFinancings,
    getDeceaseds,
    getCeremonies,
    getBeneficiaries,
    updateFinishDate,
    getCompleteContract,
    updateSalesWithWay,
    updateCashPayment,
    createPayment,
    getLastPendingPayment,
    resetFinancing
} = require('../controllers/sales');

const { importData, getLastId } = require('../controllers/imports');
const { getBranchs, getBranch, updateBranch, createBranch, deleteBranch } = require('../controllers/branchs');
const { getCalls, createCall, getCallsByEmployee, getCallsByEmployeeAndType } = require('../controllers/callcenter');
const { getWays, getCompleteWay, getWay, updateWay, createWay, deleteWay, deleteSalesWays, insertMassiveSalesWays, createSalesWays, getLastOrder, substractOrder } = require('../controllers/ways');
const { getDepartment, getDepartments, updateDepartment, createDepartment, deleteDepartment } = require('../controllers/departments');
const { getCuts, getCut, createCut, updateCutStatus, createBreakdownCut, deleteBreakdownCut, updateBreakdownCut, getBreakdownCuts } = require('../controllers/cuts');

//Generic
router.post('/genericDelete', genericDelete);
router.post('/genericGet', genericGet);
router.post('/genericUpdate', genericUpdate);

//Users
router.post('/login', login);
router.post('/register', register);
router.post('/updateUser', updateUser);
router.post('/deleteUser', deleteUser);
router.get('/getUser/:id', getUser);
router.post('/createUser', createUser);
router.get('/users', getUsers);
router.get('/getUserPermissions/:username', getUserPermissions);
router.get('/getProfiles', getProfiles);
router.get('/getPermissionsByProfile/:profile', getPermissionsByProfile);
router.post('/updatePermissions', updatePermissions);
router.post('/createProfile', createProfile);

//Contracts
router.get('/contracts', getContracts);
router.get('/getContract/:id', getContract);
router.post('/updateContract', updateContract);
router.post('/deleteContract', deleteContract);
router.get('/getCompleteContract/:id', getCompleteContract);

//Requests
router.get('/requests', getRequests);
router.post('/insertRequest', insertRequest);
router.get('/getRequest/:id', getRequest);
router.post('/updateRequest', updateRequest);
router.post('/deleteRequest', deleteRequest);

//Logo
router.post('/uploadLogo', upload.single('logo'), uploadLogo);
router.get('/getLogo', getLogo);

//Clients
router.get('/clients', getClients);
router.get('/getClient/:id', getClient);
router.post('/updateClient', updateClient);
router.post('/createClient', createClient);
router.post('/deleteClient', deleteClient);
router.post('/getClientByNameAndBirthDate', getClientByNameAndBirthDate);

//Employees
router.get('/employees', getEmployees);
router.get('/getEmployee/:id', getEmployee);
router.post('/updateEmployee', updateEmployee);
router.post('/createEmployee', createEmployee);
router.post('/deleteEmployee', deleteEmployee);
router.post('/updateEmployeesWay', updateEmployeesWay);

//Packs
router.get('/packs', getPacks);
router.get('/getPack/:id', getPack);
router.post('/updatePack', updatePack);
router.post('/createPack', createPack);
router.post('/deletePack', deletePack);

//Sales
router.get('/getSale/:id', getSale);
router.post('/createSale', createSale);
router.post('/updateSale', updateSale);
router.get('/sales', getSales);
router.post('/updateSalesWithWay', updateSalesWithWay);

//Payments
router.post('/createMassivePayment', createMassivePayment);
router.get('/getPayments/:id', getPayments);
router.post('/updateCashPayment', updateCashPayment);
router.get('/getPayment/:id', getPayment);
router.post('/createPayment', createPayment);
router.get('/getLastPendingPayment/:id', getLastPendingPayment);

//Beneficiaries
router.get('/getBeneficiary/:id', getBeneficiary);
router.post('/createBeneficiary', createBeneficiary);
router.post('/updateBeneficiary', updateBeneficiary);
router.get('/beneficiaries', getBeneficiaries);

//Financing
router.get('/getFinancing/:id', getFinancing);
router.post('/createFinancing', createFinancing);
router.post('/updateFinancing', updateFinancing);
router.get('/financings', getFinancings);
router.post('/resetFinancing', resetFinancing);

//Contract
router.get('/getContract/:id', getContract);
router.post('/createContract', createContract);
router.post('/updateContract', updateContract);

//Request
router.get('/getRequest/:id', getRequest);
router.post('/createRequest', createRequest);
router.post('/updateRequest', updateRequest);

//Ceremony
router.get('/getCeremony/:id', getCeremony);
router.post('/createCeremony', createCeremony);
router.post('/updateCeremony', updateCeremony);
router.get('/ceremonies', getCeremonies);

//Deceased
router.get('/getDeceased/:id', getDeceased);
router.post('/createDeceased', createDeceased);
router.post('/updateDeceased', updateDeceased);
router.get('/deceaseds', getDeceaseds);

//Service
router.get('/getService/:id', getService);
router.post('/createService', createService);
router.post('/updateService', updateService);

//Updates
router.post('/updateContractNumber', updateContractNumber);
router.post('/updateFinishDate', updateFinishDate);

//Imports
router.get('/getLastId/:tableName', getLastId);
router.post('/importData', importData);

//Company
router.get('/getCompanyData', getCompanyData);
router.post('/updateCompanyData', updateCompanyData);
router.post('/createCompanyData', createCompanyData);

//Branchs
router.get('/branchs', getBranchs);
router.get('/getBranch/:id', getBranch);
router.post('/updateBranch', updateBranch);
router.post('/createBranch', createBranch);
router.post('/deleteBranch', deleteBranch);

//CallCenter
router.get('/calls', getCalls);
router.post('/createCall', createCall);
router.get('/getCallsByEmployee/:idEmpleado', getCallsByEmployee);
router.post('/getCallsByEmployeeAndType', getCallsByEmployeeAndType);

//Ways
router.get('/ways', getWays);
router.get('/getWay/:id', getWay);
router.post('/updateWay', updateWay);
router.post('/createWay', createWay);
router.post('/deleteWay', deleteWay);
router.post('/createSalesWays', createSalesWays);
router.post('/insertMassiveSalesWays', insertMassiveSalesWays);
router.post('/deleteSalesWays', deleteSalesWays);
router.get('/getLastOrder/:id', getLastOrder);
router.post('/substractOrder', substractOrder);
router.get('/getCompleteWay/:id', getCompleteWay);

//Departments
router.get('/departments', getDepartments);
router.get('/getDepartment/:id', getDepartment);
router.post('/updateDepartment', updateDepartment);
router.post('/createDepartment', createDepartment);
router.post('/deleteDepartment', deleteDepartment);

//Cuts
router.get('/cuts', getCuts);
router.get('/getCut/:id', getCut);
router.post('/updateCutStatus', updateCutStatus);
router.post('/createCut', createCut);
router.post('/createBreakdownCut', createBreakdownCut);
router.post('/deleteBreakdownCut', deleteBreakdownCut);
router.post('/updateBreakdownCut', updateBreakdownCut);
router.get('/getBreakdownCut/:id', getBreakdownCuts);

module.exports = router;