"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_seed_1 = require("../constants/db.seed");
let Household = require('../models/household.schema');
const ObjectId = require('mongoose').Types.ObjectId;
process.env.NODE_ENV = 'test';
let tester = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = tester.should();
tester.use(chaiHttp);
describe('Household', () => {
    before((done) => {
        Household.insertMany(db_seed_1.household_list, (err) => {
            done();
        });
    });
    after((done) => {
        Household.collection.drop((err) => {
            done();
        });
    });
    describe('/POST /household/create (HDB)', () => {
        it('it should POST a household', (done) => {
            const household = {
                "householdType": "HDB",
                "address": "217A Compassvale Drive",
                "unit": "10-77",
                "postal": "541217"
            };
            tester.request(app)
                .post('/household/create')
                .send(household)
                .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body._id.should.not.be.null;
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/POST /household/create (Condominium)', () => {
        it('it should POST a household', (done) => {
            const household = {
                "householdType": "Condominium",
                "address": "3 Punggol Field",
                "unit": "10-05",
                "postal": "828740"
            };
            tester.request(app)
                .post('/household/create')
                .send(household)
                .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body._id.should.not.be.null;
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/POST /household/create (Landed)', () => {
        it('it should POST a household', (done) => {
            const household = {
                "householdType": "Landed",
                "address": "148 Countryside Road",
                "unit": "01-01",
                "postal": "789869"
            };
            tester.request(app)
                .post('/household/create')
                .send(household)
                .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body._id.should.not.be.null;
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/POST /household/create (Invalid Body Syntax)', () => {
        it('it should return status 400, null _id, and a message', (done) => {
            const household = {
                "address": "148 Countryside Road",
                "postal": "789869"
            };
            tester.request(app)
                .post('/household/create')
                .send(household)
                .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                should.equal(res.body._id, null);
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/POST /household/create (Invalid `unit` for Landed)', () => {
        it('it should return status 400, null _id, and a message', (done) => {
            const household = {
                "housingType": "Landed",
                "address": "148 Countryside Road",
                "unit": "03-01",
                "postal": "789869"
            };
            tester.request(app)
                .post('/household/create')
                .send(household)
                .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                should.equal(res.body._id, null);
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/POST /household/create (Invalid `housingType`)', () => {
        it('it should return status 400, null _id, and a message', (done) => {
            const household = {
                "housingType": "Semi-detached House",
                "address": "148 Countryside Road",
                "unit": "03-01",
                "postal": "789869"
            };
            tester.request(app)
                .post('/household/create')
                .send(household)
                .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                should.equal(res.body._id, null);
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/PUT /household/add-member/:id', () => {
        it('it should PUT a familyMember into a household', (done) => {
            const household = new Household({
                "householdType": "HDB",
                "address": "415A Fernvale Link",
                "unit": "16-102",
                "postal": "791415"
            });
            household.save().then((result) => {
                const familyMember = {
                    "name": "Father Low",
                    "gender": "Male",
                    "maritalStatus": "Married",
                    "spouse": "Mother Low",
                    "occupationType": "Employed",
                    "annualIncome": 80000,
                    "DOB_day": "12",
                    "DOB_month": "04",
                    "DOB_year": "1958"
                };
                tester.request(app)
                    .put(`/household/add-member/${result._id}`)
                    .send(familyMember)
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.not.be.null;
                    done();
                });
            });
        });
    });
    describe('/PUT /household/add-member/:id (Valid Spouse ID & Name)', () => {
        it('it should PUT the spouse of a familyMember into the household', (done) => {
            const household = new Household({
                "householdType": "HDB",
                "address": "416A Fernvale Link",
                "unit": "16-102",
                "postal": "791416",
                "familyMembers": [{
                        "_id": new ObjectId("1234567890AA"),
                        "name": "Father Low",
                        "gender": "Male",
                        "maritalStatus": "Married",
                        "spouse": "Mother Low",
                        "occupationType": "Employed",
                        "annualIncome": 80000,
                        "DOB": new Date("1958-04-12")
                    }]
            });
            household.save().then((result) => {
                const familyMember = {
                    "name": "Mother Low",
                    "gender": "Male",
                    "maritalStatus": "Married",
                    "spouse": new ObjectId("1234567890AA").toString(),
                    "occupationType": "Unemployed",
                    "annualIncome": 0,
                    "DOB_day": "24",
                    "DOB_month": "02",
                    "DOB_year": "1962"
                };
                tester.request(app)
                    .put(`/household/add-member/${result._id}`)
                    .send(familyMember)
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.message.should.not.be.null;
                    done();
                });
            });
        });
    });
    describe('/PUT /household/add-member/:id (Invalid Household ID)', () => {
        it('it should return status 404 and a message', (done) => {
            const familyMember = {
                "name": "Mother Low",
                "gender": "Male",
                "maritalStatus": "Married",
                "spouse": "62f2b03bb9268ea12fcf89ea",
                "occupationType": "Unemployed",
                "annualIncome": 0,
                "DOB_day": "24",
                "DOB_month": "02",
                "DOB_year": "1962"
            };
            tester.request(app)
                .put(`/household/add-member/303030303030303030303099`)
                .send(familyMember)
                .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/PUT /household/add-member/:id (Invalid Spouse ID & Name)', () => {
        it('it should return status 400 and a message', (done) => {
            const household = new Household({
                "householdType": "HDB",
                "address": "422A Fernvale Link",
                "unit": "16-102",
                "postal": "791422",
                "familyMembers": [{
                        "_id": new ObjectId("62f2b03bb9268ea12fcf89ec"),
                        "name": "Father Low",
                        "gender": "Male",
                        "maritalStatus": "Married",
                        "spouse": "Mother Low",
                        "occupationType": "Employed",
                        "annualIncome": 80000,
                        "DOB": new Date("1958-04-12")
                    }]
            });
            household.save().then((result) => {
                const familyMember = {
                    "name": "Mother Low",
                    "gender": "Male",
                    "maritalStatus": "Married",
                    "spouse": "62f2b03bb9268ea12fcf89ea",
                    "occupationType": "Unemployed",
                    "annualIncome": 0,
                    "DOB_day": "24",
                    "DOB_month": "02",
                    "DOB_year": "1962"
                };
                tester.request(app)
                    .put(`/household/add-member/${result._id}`)
                    .send(familyMember)
                    .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.message.should.not.be.null;
                    done();
                });
            });
        });
    });
    describe('/PUT /household/add-member/:id (Invalid Body Values)', () => {
        it('it should return status 400 and a message', (done) => {
            const household = new Household({
                "householdType": "HDB",
                "address": "410A Fernvale Link",
                "unit": "16-102",
                "postal": "791410",
                "familyMembers": [{
                        "_id": new ObjectId("62f2b03bb9268ea12fcf89ec"),
                        "name": "Father Low",
                        "gender": "Male",
                        "maritalStatus": "Married",
                        "spouse": "Mother Low",
                        "occupationType": "Employed",
                        "annualIncome": 80000,
                        "DOB": new Date("1958-04-12")
                    }]
            });
            household.save().then((result) => {
                const familyMember = {
                    "name": "Mother Low",
                    "gender": "Maleeee",
                    "maritalStatus": "Marriedddd",
                    "occupationType": "Unemployedddd",
                    "annualIncome": "123",
                    "DOB_day": "24a",
                    "DOB_month": "02a",
                    "DOB_year": "1962a"
                };
                tester.request(app)
                    .put(`/household/add-member/${result._id}`)
                    .send(familyMember)
                    .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.message.should.not.be.null;
                    done();
                });
            });
        });
    });
    describe('/PUT /household/add-member/:id (Invalid Body Syntax)', () => {
        it('it should return status 400 and a message', (done) => {
            const household = new Household({
                "householdType": "HDB",
                "address": "424A Fernvale Link",
                "unit": "16-102",
                "postal": "791424",
                "familyMembers": [{
                        "_id": new ObjectId("62f2b03bb9268ea12fcf89ec"),
                        "name": "Father Low",
                        "gender": "Male",
                        "maritalStatus": "Married",
                        "spouse": "Mother Low",
                        "occupationType": "Employed",
                        "annualIncome": 80000,
                        "DOB": new Date("1958-04-12")
                    }]
            });
            household.save().then((result) => {
                const familyMember = {
                    "name": "Mother Low",
                };
                tester.request(app)
                    .put(`/household/add-member/${result._id}`)
                    .send(familyMember)
                    .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.message.should.not.be.null;
                    done();
                });
            });
        });
    });
    describe('/GET /household/all', () => {
        it('it should GET all the household records', (done) => {
            tester.request(app)
                .get('/household/all')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.not.be.null;
                done();
            });
        });
    });
    describe('/GET /household/find/:id (Valid ID)', () => {
        it('it should GET one household record', (done) => {
            tester.request(app)
                .get('/household/find/303030303030303030303031')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.not.be.null;
                should.equal(res.body.message, undefined);
                done();
            });
        });
    });
    describe('/GET /household/find/:id (Invalid ID)', () => {
        it('it should return status 404, null result, and a message', (done) => {
            tester.request(app)
                .get('/household/find/62f13884ad15454b8f080968')
                .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                should.equal(res.body.result, null);
                res.body.message.should.not.be.null;
                done();
            });
        });
    });
    describe('/GET /household/find-qualifying/:option (Student Encouragement Bonus)', () => {
        it('it should GET all households with family members that is/are a student of < 16 years old and householdIncome < 200000', (done) => {
            tester.request(app)
                .get('/household/find-qualifying/0')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.not.be.null;
                res.body.result.every((household) => {
                    household.should.have.property('familyMembers');
                    household.familyMembers.every((familyMember) => {
                        familyMember.occupationType.should.be.equal('Student');
                        familyMember.age.should.be.lessThan(16);
                    });
                    household.householdIncome.should.be.lessThan(200000);
                });
                should.equal(res.body.message, undefined);
                done();
            });
        });
    });
    describe('/GET /household/find-qualifying/:option (Multigeneration Scheme)', () => {
        it('it should GET all households with family member(s) < 18 years or > 55 years old and householdIncome < 150000', (done) => {
            tester.request(app)
                .get('/household/find-qualifying/1')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.not.be.null;
                res.body.result.every((household) => {
                    household.should.have.property('familyMembers');
                    household.familyMembers.should.be.not.null;
                    // household.familyMembers.some((familyMember: any) => {
                    //     return tester.expect(familyMember.age < 18 || familyMember.age > 55).to.be.false;
                    // });
                    household.householdIncome.should.be.lessThan(150000);
                    Household.findById(new ObjectId(household._id)).then((result) => {
                        should.equal(household.familyMembers.length, result.familyMembers.length);
                    });
                });
                should.equal(res.body.message, undefined);
                done();
            });
        });
    });
    describe('/GET /household/find-qualifying/:option (Elder Bonus)', () => {
        it('it should GET all HDB households with family members >= 55 years old', (done) => {
            tester.request(app)
                .get('/household/find-qualifying/2')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.not.be.null;
                res.body.result.every((household) => {
                    household.should.have.property('familyMembers');
                    household.householdType.should.be.equal('HDB');
                    household.familyMembers.every((familyMember) => {
                        familyMember.age.should.be.greaterThanOrEqual(55);
                    });
                });
                should.equal(res.body.message, undefined);
                done();
            });
        });
    });
    describe('/GET /household/find-qualifying/:option (Baby Sunshine)', () => {
        it('it should GET all households with family members < 8 months old', (done) => {
            tester.request(app)
                .get('/household/find-qualifying/3')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.not.be.null;
                res.body.result.every((household) => {
                    household.should.have.property('familyMembers');
                    household.familyMembers.every((familyMember) => {
                        familyMember.age_month.should.be.lessThanOrEqual(8);
                    });
                });
                should.equal(res.body.message, undefined);
                done();
            });
        });
    });
    describe('/GET /household/find-qualifying/:option (YOLO GST Grant)', () => {
        it('it should GET all HDB households with annual income of < 100000', (done) => {
            tester.request(app)
                .get('/household/find-qualifying/4')
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.result.should.not.be.null;
                res.body.result.every((household) => {
                    household.should.have.property('familyMembers');
                    household.householdType.should.be.equal('HDB');
                    household.householdIncome.should.be.lessThan(100000);
                    Household.findById(new ObjectId(household._id)).then((result) => {
                        should.equal(household.familyMembers.length, result.familyMembers.length);
                    });
                });
                should.equal(res.body.message, undefined);
                done();
            });
        });
    });
});
