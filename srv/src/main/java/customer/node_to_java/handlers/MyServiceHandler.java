package customer.node_to_java.handlers;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.authentication.JwtTokenAuthenticationInfo;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.UserInfo;

import cds.gen.MySelf;
import cds.gen.myservice.CalSalaryContext;
import cds.gen.myservice.Employees;
import cds.gen.myservice.Employees_;
import cds.gen.myservice.MyService_;
import cds.gen.myservice.Roles;
import cds.gen.myservice.Roles_;
import cds.gen.myservice.WhoamiContext;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
@ServiceName(MyService_.CDS_NAME)
public class MyServiceHandler implements EventHandler {
	private final PersistenceService db;

	@Before(event = CqnService.EVENT_CREATE, entity = Employees_.CDS_NAME)
	public void setBaseSalary(Employees employee) {
		String roleId = employee.getRoleId();
		// get base salary
		CqnSelect query = Select.from(Roles_.CDS_NAME)
				.byId(roleId)
				.columns("baseSalary");
		Optional<Roles> role = db.run(query).first(Roles.class);
		// set salary
		employee.setSalary(role.get().getBaseSalary());
	}

	@On(event = CalSalaryContext.CDS_NAME)
	public void calSalary(CalSalaryContext ctx) {
		String id = ctx.getId();
		CqnSelect queryEmployee = Select.from(Employees_.CDS_NAME)
				.byId(id)
				.columns("hireDate", "salary", "role_ID");

		Optional<Employees> empl = db.run(queryEmployee)
				.first(Employees.class);

		String roleId = empl.get()
				.getRoleId();

		CqnSelect queryRole = Select.from(Roles_.CDS_NAME)
				.byId(roleId)
				.columns("baseSalary");
		Optional<Roles> role = db.run(queryRole)
				.first(Roles.class);

		double baseSalary = role.get()
				.getBaseSalary();
		LocalDate hireDate = empl.get()
				.getHireDate();
		LocalDate now = LocalDate.now();
		int yearsDiff = Period.between(hireDate, now)
				.getYears();

		double salary = baseSalary + 1000 * yearsDiff;

		CqnUpdate update = Update.entity(Employees_.CDS_NAME)
				.byId(empl.get()
						.getId())
				.data("salary", salary);
		db.run(update);
		ctx.setResult(salary);
	}

	@On(event = "whoami")
	public void whoami(WhoamiContext ctx) {
		UserInfo userInfo = ctx.getUserInfo();
		JwtTokenAuthenticationInfo authInfo = (JwtTokenAuthenticationInfo) ctx.getAuthenticationInfo();
		List<String> roles = new ArrayList<String>(userInfo.getRoles());
		// set result
		MySelf me = MySelf.create();
		me.setUsername(userInfo.getName());
		me.setRole(roles);
		Optional.ofNullable(authInfo)
				.map(a -> a.getToken())
				.ifPresent(me::setJwt);

		ctx.setResult(me);
	}
}
